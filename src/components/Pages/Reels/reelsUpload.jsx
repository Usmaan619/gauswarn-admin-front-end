import React, { useEffect, useState } from "react";
import {
  getData,
  postData,
  deleteDataNew,
} from "../../Common/APIs/api";
import { toastSuccess, toastError } from "../../../Services/toast.service";
import { FiInstagram, FiPlus, FiEye, FiTrash2, FiCopy, FiInfo, FiX } from "react-icons/fi";

const extractReelId = (value) => {
  if (!value) return "";
  const match = value.match(/instagram\.com\/reel\/([A-Za-z0-9_-]+)/);
  return match ? match[1] : value;
};

const InstaReelEmbed = ({ reelId = "" }) => {
  if (!reelId) return null;
  const src = `https://www.instagram.com/reel/${reelId}/embed`;
  return (
    <iframe
      src={src}
      style={{ width: "100%", height: 600, border: "none" }}
      allow="autoplay; encrypted-media; picture-in-picture"
      allowFullScreen
      title="Instagram Reel"
    />
  );
};

const ReelUploader = () => {
  const [reelId, setReelId] = useState("");
  const [reels, setReels] = useState([]);
  const [view, setView] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadReels = async () => {
    setLoading(true);
    try {
      const res = await getData("/reels/all");
      if (res.success) setReels(res.reels || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const saveReel = async () => {
    const pureId = extractReelId(reelId?.trim());
    if (!pureId) return toastError("Valid Reel ID required");

    const payload = { reel_id: pureId };
    try {
      let res;
      if (editItem) {
        res = await postData(`/reels/${editItem}`, payload);
      } else {
        res = await postData("/reels", payload);
      }

      if (res && res?.data?.success) {
        toastSuccess(editItem ? "Reel updated" : "Reel added successfully");
        setReelId("");
        setEditItem(null);
        await loadReels();
      } else {
        toastError(res?.message || "Failed to save reel");
      }
    } catch (e) {
      toastError("Request failed");
    }
  };

  const deleteReel = async (id) => {
    if (!window.confirm("Are you sure you want to delete this reel?")) return;
    try {
      const res = await deleteDataNew(`/reels-delete/${id}`);
      if (res.success) {
        toastSuccess("Reel removed");
        await loadReels();
      } else toastError("Delete operation failed");
    } catch (err) {
      toastError("Error during deletion");
    }
  };

  useEffect(() => {
    loadReels();
  }, []);

  return (
    <div className="reels-page fade-in">
      <div className="page-header mb-4">
        <h2 className="glow-text d-flex align-items-center gap-2">
          <FiInstagram className="text-info" />
          Instagram Reels
        </h2>
        <p className="text-secondary">Sync and showcase your best Instagram video content on the platform.</p>
      </div>

      <div className="row g-4">
        <div className="col-lg-5">
          <div className="glass-card p-4">
            <h5 className="mb-4 d-flex align-items-center gap-2">
              <FiPlus className="text-info" />
              Add New Reel
            </h5>
            <div className="mb-4">
              <label className="form-label small text-secondary uppercase fw-bold">Instagram Link / Reel ID</label>
              <input
                className="form-control glass-card text-white border-0 py-3"
                style={{ background: 'rgba(255,255,255,0.05)' }}
                value={reelId}
                placeholder="https://instagram.com/reel/C..."
                onChange={(e) => setReelId(extractReelId(e.target.value))}
                onKeyDown={(e) => e.key === "Enter" && saveReel()}
              />
            </div>
            <button className="btn btn-info w-100 py-3 d-flex align-items-center justify-content-center gap-2" onClick={saveReel}>
              <FiPlus size={20} /> {editItem ? "Update Content" : "Publish Reel"}
            </button>
            {editItem && (
              <button className="btn btn-outline-secondary w-100 mt-2 py-3" onClick={() => {setEditItem(null); setReelId("");}}>
                Cancel Action
              </button>
            )}

            <div className="mt-4 p-3 glass-card d-flex align-items-start gap-2" style={{ background: 'rgba(59, 130, 246, 0.05)' }}>
               <FiInfo className="text-info mt-1" />
               <small className="text-secondary">Supported: Full URLs from Instagram or just the shortcode ID (e.g., C3pXylL...).</small>
            </div>
          </div>
        </div>

        <div className="col-lg-7">
          <div className="glass-card p-4">
            <h5 className="mb-4 d-flex align-items-center gap-2">
              <FiInstagram className="text-info" />
              Synced Library
            </h5>
            
            <div className="reels-list" style={{ maxHeight: '600px', overflowY: 'auto' }}>
              {loading ? (
                <div className="text-center py-5"><div className="spinner-border text-info small"></div></div>
              ) :reels?.length > 0 ? (
                reels.map((r) => (
                  <div key={r.id} className="glass-card p-3 mb-3 d-flex justify-content-between align-items-center border-0" 
                       style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <div>
                      <span className="small text-secondary d-block uppercase mb-1">Reel Shortcode</span>
                      <code className="text-info glow-text">{r.reel_id}</code>
                    </div>
                    <div className="d-flex gap-2">
                      <button className="btn btn-sm glass-card text-white p-2" onClick={() => setView(r.reel_id)}>
                        <FiEye size={16} />
                      </button>
                      <button className="btn btn-sm glass-card text-white p-2" onClick={() => {
                        navigator.clipboard.writeText(`https://www.instagram.com/reel/${r.reel_id}/`);
                        toastSuccess("Link Copied!");
                      }}>
                        <FiCopy size={16} />
                      </button>
                      <button className="btn btn-sm glass-card text-danger p-2" onClick={() => deleteReel(r.id)}>
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-5 opacity-20">
                  <FiInstagram size={40} className="mb-3" />
                  <p>No reels found in database.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* VIEW MODAL */}
      {view && (
        <div
          className="modal-overlay"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,.85)",
            backdropFilter: "blur(12px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
            zIndex: 9999,
          }}
          onClick={() => setView(null)}
        >
          <div
            className="glass-card overflow-hidden position-relative"
            style={{
              width: "90%",
              maxWidth: "500px",
              background: '#0a0b14'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-3 border-bottom border-light d-flex justify-content-between align-items-center">
              <span className="small uppercase fw-bold">Live Preview</span>
              <button className="btn btn-sm text-white" onClick={() => setView(null)}><FiX size={20}/></button>
            </div>
            <div className="p-0">
              <InstaReelEmbed reelId={view} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReelUploader;
