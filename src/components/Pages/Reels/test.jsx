import React, { useState, useRef, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { toastSuccess, toastError } from "../../../Services/toast.service";
import {
  deleteDataReel,
  getData,
  postFormData,
} from "../../Common/APIs/api";
import { FiVideo, FiUpload, FiRefreshCw, FiPlay, FiTrash2, FiX, FiCheck, FiMoreVertical } from "react-icons/fi";

const MAX_VIDEO_SIZE = 150 * 1024 * 1024;
const MAX_THUMB_SIZE = 115 * 1024 * 1024;
const MAX_VIDEO_DURATION = 60;

const uid = () => Math.random().toString(36).substring(2, 10);

const chunkIntoSections = (array, chunkCount = 4) => {
  const perSection = Math.ceil(array.length / chunkCount);
  const result = [];
  for (let i = 0; i < chunkCount; i++) {
    result.push(array.slice(i * perSection, (i + 1) * perSection));
  }
  return result;
};

const makeEmptySection = () => ({
  reels: [],
  previews: [],
  titles: [],
  descriptions: [],
  thumbs: [],
  loading: false,
  progress: 0,
  uploaded: false,
});

const ReelUploader = () => {
  const [sections, setSections] = useState(
    new Array(4).fill(0).map(() => makeEmptySection()),
  );
  const playAllRef = useRef(null);
  const [playQueue, setPlayQueue] = useState([]);
  const [playIndex, setPlayIndex] = useState(0);
  const [allReels, setAllReels] = useState([]);

  useEffect(() => {
    loadAllReels();
  }, []);

  const getVideoDuration = (file) =>
    new Promise((resolve) => {
      const v = document.createElement("video");
      v.preload = "metadata";
      v.onloadedmetadata = () => resolve(v.duration);
      v.onerror = () => resolve(999);
      v.src = URL.createObjectURL(file);
    });

  const extractTitle = (filename) =>
    filename.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ");

  const mapServerReelToLocal = (r) => ({
    tempId: uid(),
    id: r.id,
    server: true,
    name: r.title || "video.mp4",
    video_url: r.video_url,
    thumb_url: r.thumb_url,
    title: r.title || "",
    description: r.description || "",
    created_at: r.created_at,
  });

  const loadAllReels = async () => {
    try {
      const response = await getData("reels/all");
      const { success, reels } = response || {};

      if (success && Array.isArray(reels) && reels.length > 0) {
        setAllReels(reels);
        const localReels = reels.map(mapServerReelToLocal);
        const distributed = chunkIntoSections(localReels, 4);
        const updatedSections = new Array(4).fill(0).map((_, secIndex) => {
          const group = distributed[secIndex] || [];
          if (group.length > 0) {
            return {
              ...makeEmptySection(),
              reels: group,
              previews: group.map((r) => r.video_url || ""),
              titles: group.map((r) => r.title || ""),
              descriptions: group.map((r) => r.description || ""),
              uploaded: true,
            };
          }
          return makeEmptySection();
        });
        setSections(updatedSections);
        toastSuccess(`Loaded ${reels.length} reels`);
      }
    } catch (err) {
      toastError(`Error: ${err.message || "Failed to load reels"}`);
    }
  };

  const openPlayAllModal = (previews) => {
    if (!previews || previews.length === 0) return;
    setPlayQueue(previews);
    setPlayIndex(0);
    const video = playAllRef.current;
    if (video) {
      video.src = previews[0];
      video.play().catch(() => {});
    }
    const el = document.getElementById("playAllModal");
    if (el) el.style.display = "flex";
  };

  const closePlayAllModal = () => {
    const video = playAllRef.current;
    if (video) {
      video.pause();
      video.src = "";
    }
    const el = document.getElementById("playAllModal");
    if (el) el.style.display = "none";
  };

  const nextPlay = () => {
    if (playIndex + 1 >= playQueue.length) {
      closePlayAllModal();
      return;
    }
    const next = playIndex + 1;
    setPlayIndex(next);
    const video = playAllRef.current;
    if (video) {
      video.src = playQueue[next];
      video.play().catch(() => {});
    }
  };

  const processReels = async (secIndex, filesList) => {
    const updated = [...sections];
    const validReels = [];
    const previews = [];
    const titles = [];
    const descriptions = [];

    for (let file of filesList) {
      if (!file.type.startsWith("video/")) {
        toastError(`Invalid video: ${file.name}`);
        continue;
      }
      if (file.size > MAX_VIDEO_SIZE) {
        toastError(`Size limit 150MB: ${file.name}`);
        continue;
      }

      const duration = await getVideoDuration(file);
      if (duration > MAX_VIDEO_DURATION) {
        toastError(`Duration limit 60s: ${file.name}`);
        continue;
      }

      const tempId = uid();
      const localUrl = URL.createObjectURL(file);
      validReels.push({
        tempId,
        server: false,
        file,
        name: file.name,
        title: extractTitle(file.name),
        description: "",
        video_url: localUrl,
      });

      previews.push(localUrl);
      titles.push(extractTitle(file.name));
      descriptions.push("");
    }

    updated[secIndex].reels = validReels;
    updated[secIndex].previews = previews;
    updated[secIndex].titles = titles;
    updated[secIndex].descriptions = descriptions;
    updated[secIndex].uploaded = false;
    updated[secIndex].thumbs = [];

    setSections(updated);
  };

  const handleReelsSelection = (secIndex, e) => processReels(secIndex, Array.from(e.target.files));
  const handleThumbSelection = (index, e) => {
    const updated = [...sections];
    updated[index].thumbs = Array.from(e.target.files);
    setSections(updated);
  };

  const handleTitleChange = (sec, reelIndex, value) => {
    const updated = [...sections];
    updated[sec].titles[reelIndex] = value;
    if (updated[sec].reels[reelIndex]) updated[sec].reels[reelIndex].title = value;
    setSections(updated);
  };

  const handleDescriptionChange = (sec, reelIndex, value) => {
    const updated = [...sections];
    updated[sec].descriptions[reelIndex] = value;
    if (updated[sec].reels[reelIndex]) updated[sec].reels[reelIndex].description = value;
    setSections(updated);
  };

  const handleDragEnd = (secIndex, result) => {
    if (!result.destination) return;
    const updated = [...sections];
    const sec = updated[secIndex];
    const reels = Array.from(sec.reels);
    const [removed] = reels.splice(result.source.index, 1);
    reels.splice(result.destination.index, 0, removed);
    sec.reels = reels;
    sec.previews = reels.map(r => r.video_url);
    sec.titles = reels.map(r => r.title);
    sec.descriptions = reels.map(r => r.description);
    setSections(updated);
  };

  const handleReelUpload = async (secIndex) => {
    const section = sections[secIndex];
    if (section.reels.length === 0) return toastError("Add reels first");

    const fd = new FormData();
    section.reels.forEach((item, index) => {
      if (!item.server && item.file) {
        fd.append("reels", item.file);
        fd.append("types", "file");
        fd.append("ids", item.tempId || "");
      } else {
        fd.append("reels", "");
        fd.append("types", "server");
        fd.append("ids", item.id);
      }
      fd.append("titles", item.title || "");
      fd.append("descriptions", item.description || "");
      fd.append("order", index.toString());
    });
    section.thumbs.forEach((f) => fd.append("thumbs", f));

    try {
      const updated = [...sections];
      updated[secIndex].loading = true;
      setSections(updated);

      const res = await postFormData("/upload-multiple-reels", fd);
      if (res?.data?.success) {
        toastSuccess("Upload complete!");
        loadAllReels();
      }
    } catch (err) {
      toastError("Upload failed");
    } finally {
      const updated = [...sections];
      updated[secIndex].loading = false;
      setSections(updated);
    }
  };

  const handleDeleteReel = async (idOrTempId, serverFlag = false) => {
    if (!window.confirm("Remove this reel?")) return;
    if (serverFlag) {
      const res = await deleteDataReel(`reels/${idOrTempId}`);
      if (res?.success) {
        toastSuccess("Deleted");
        loadAllReels();
      }
    } else {
      const updated = [...sections];
      updated.forEach(sec => {
        const idx = sec.reels.findIndex(r => r.tempId === idOrTempId);
        if (idx !== -1) {
          sec.reels.splice(idx, 1);
          sec.previews.splice(idx, 1);
          sec.titles.splice(idx, 1);
          sec.descriptions.splice(idx, 1);
        }
      });
      setSections(updated);
    }
  };

  return (
    <div className="advanced-reels-page fade-in">
      <div className="page-header mb-4 d-flex justify-content-between align-items-center">
        <div>
          <h2 className="glow-text d-flex align-items-center gap-2">
            <FiVideo className="text-info" />
            Advanced Reel Manager
          </h2>
          <p className="text-secondary m-0">Drag and drop reordering, bulk uploads, and multi-section organization.</p>
        </div>
        <button className="btn btn-outline-info d-flex align-items-center gap-2 px-4" onClick={loadAllReels}>
          <FiRefreshCw /> Refresh Sync
        </button>
      </div>

      <div className="row g-4">
        {sections.map((section, secIndex) => (
          <div key={secIndex} className="col-xl-6">
            <div className="glass-card p-4 h-100 d-flex flex-column">
              <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom border-light">
                <h5 className="m-0 uppercase small tracking-wider">Storage Section {secIndex + 1}</h5>
                <div className="d-flex gap-2">
                   {section.reels.length > 0 && (
                     <button className="btn btn-sm btn-info text-dark d-flex align-items-center gap-1 px-3" onClick={() => openPlayAllModal(section.previews)}>
                       <FiPlay size={12}/> Play All
                     </button>
                   )}
                   <span className="badge glass-card px-3">{section.reels.length} Items</span>
                </div>
              </div>

              <div className="flex-grow-1">
                {section.reels.length === 0 ? (
                  <div className="upload-placeholder glass-card d-flex flex-column align-items-center justify-content-center py-5 border-dashed" 
                       style={{ borderStyle: 'dashed', cursor: 'pointer' }}
                       onClick={() => document.getElementById(`advanced-input-${secIndex}`).click()}>
                    <FiUpload size={32} className="text-secondary mb-2" />
                    <p className="text-secondary small m-0">Click or Drop Videos</p>
                    <input id={`advanced-input-${secIndex}`} type="file" multiple accept="video/*" hidden onChange={(e) => handleReelsSelection(secIndex, e)} />
                  </div>
                ) : (
                  <DragDropContext onDragEnd={(r) => handleDragEnd(secIndex, r)}>
                    <Droppable droppableId={`drop-${secIndex}`}>
                      {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef} className="d-flex flex-column gap-3">
                          {section.reels.map((reel, idx) => (
                            <Draggable key={reel.id ? `db-${reel.id}` : `temp-${reel.tempId}`} draggableId={reel.id ? `db-${reel.id}` : `temp-${reel.tempId}`} index={idx}>
                              {(drag, snapshot) => (
                                <div ref={drag.innerRef} {...drag.draggableProps} {...drag.dragHandleProps} 
                                     className={`glass-card p-3 d-flex gap-3 align-items-center ${snapshot.isDragging ? 'neon-border' : ''}`}
                                     style={{ ...drag.draggableProps.style, background: 'rgba(255,255,255,0.03)' }}>
                                  <div className="drag-handle text-secondary"><FiMoreVertical /></div>
                                  <div className="preview-thumb rounded overflow-hidden" style={{ width: '80px', height: '80px', flexShrink: 0 }}>
                                    <video src={reel.video_url} className="w-100 h-100" style={{ objectFit: 'cover' }} />
                                  </div>
                                  <div className="flex-grow-1">
                                    <input value={section.titles[idx] || ""} onChange={(e) => handleTitleChange(secIndex, idx, e.target.value)} 
                                           className="form-control-sm form-control glass-card text-white border-0 mb-1" placeholder="Title" />
                                    <input value={section.descriptions[idx] || ""} onChange={(e) => handleDescriptionChange(secIndex, idx, e.target.value)} 
                                           className="form-control-sm form-control glass-card text-secondary border-0" placeholder="Caption..." />
                                  </div>
                                  <button className="btn btn-sm text-danger" onClick={() => handleDeleteReel(reel.server ? reel.id : reel.tempId, reel.server)}>
                                    <FiTrash2 />
                                  </button>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                )}
              </div>

              <div className="mt-4 pt-3 border-top border-light d-flex gap-3">
                 <button className="btn btn-info flex-grow-1 py-3 d-flex align-items-center justify-content-center gap-2" 
                         disabled={section.loading || section.reels.length === 0}
                         onClick={() => handleReelUpload(secIndex)}>
                   {section.loading ? <div className="spinner-border spinner-border-sm" /> : <FiUpload />}
                   {section.loading ? 'Uploading...' : 'Save Section Progress'}
                 </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Play All Modal */}
      <div id="playAllModal" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(10px)', display: 'none', zIndex: 9999, justifyContent: 'center', alignItems: 'center' }}>
          <div className="glass-card overflow-hidden position-relative" style={{ width: '90%', maxWidth: '400px', background: '#000' }}>
            <video ref={playAllRef} className="w-100" style={{ height: '70vh', objectFit: 'contain' }} onEnded={nextPlay} />
            <div className="p-3 d-flex justify-content-between align-items-center">
               <span className="text-secondary small">Playing {playIndex + 1} of {playQueue.length}</span>
               <button className="btn btn-sm btn-danger px-4" onClick={closePlayAllModal}>Close</button>
            </div>
          </div>
      </div>
    </div>
  );
};

export default ReelUploader;
