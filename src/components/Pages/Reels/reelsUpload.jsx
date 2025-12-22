import React, { useEffect, useState } from "react";
import Sidebar from "../../Common/SideBar/sidebar";
import Navbar from "../../Common/Navbar/navbar";
import {
  getData,
  postData,
  deleteData,
  deleteDataNew,
} from "../../Common/APIs/api";
import { toastSuccess, toastError } from "../../../Services/toast.service";

// Extract ID from instagram link
const extractReelId = (value) => {
  if (!value) return "";
  const match = value.match(/instagram\.com\/reel\/([A-Za-z0-9_-]+)/);
  return match ? match[1] : value;
};

// Instagram Embed
const InstaReelEmbed = ({ reelId = "" }) => {
  if (!reelId) return null;
  const src = `https://www.instagram.com/reel/${reelId}/embed`;
  return (
    <iframe
      src={src}
      style={{ width: "100%", height: 600, border: "none" }}
      allow="autoplay; encrypted-media; picture-in-picture"
      allowFullScreen
    />
  );
};

const ReelUploader = () => {
  const [reelId, setReelId] = useState("");
  const [reels, setReels] = useState([]);
  const [view, setView] = useState(null);
  const [editItem, setEditItem] = useState(null);

  // load data
  const loadReels = async () => {
    const res = await getData("/reels/all"); // <-- IMPORTANT
    if (res.success) {
      setReels(res.reels);
    }
  };

  // save / update
  const saveReel = async () => {
    const pureId = extractReelId(reelId?.trim());

    if (!pureId) return toastError("Valid Reel ID required");

    const payload = { reel_id: pureId }; // always send correct key

    try {
      let res;
      if (editItem) {
        res = await postData(`/reels/${editItem}`, payload);
      } else {
        res = await postData("/reels", payload);
      }

      console.log("SAVE RESPONSE:", res);

      if (res && res?.data?.success) {
        toastSuccess(editItem ? "Updated" : "Added");
        setReelId("");
        setEditItem(null);
        await loadReels();
      } else {
        toastError(res?.message || "Failed saving reel!");
      }
    } catch (e) {
      console.error(e);
      toastError("Request Failed!");
    }
  };

  // delete
  const deleteReel = async (id) => {
    if (!window.confirm("Delete?")) return;
    const res = await deleteDataNew(`/reels-delete/${id}`);
    if (res.success) {
      toastSuccess("Deleted");
      await loadReels();
    } else toastError("Failed");
  };

  const startEdit = (id, rid) => {
    setEditItem(id);
    setReelId(rid);
  };

  useEffect(() => {
    loadReels();
  }, []);

  return (
    <div className="container-fluid px-0 min-vh-100">
      <Navbar />
      <div className="row g-0">
        <div className="col-lg-2 d-none d-lg-block">
          <Sidebar />
        </div>

        <div className="col-12 col-lg-10 p-4">
          <h2>Instagram Reels</h2>
          <p>Paste Instagram link or reel ID</p>

          <input
            className="form-control"
            value={reelId}
            placeholder="Reel ID or Link"
            onChange={(e) => setReelId(extractReelId(e.target.value))}
            onKeyDown={(e) => e.key === "Enter" && saveReel()}
          />

          <button className="btn btn-primary mt-2" onClick={saveReel}>
            {editItem ? "Update" : "Add Reel"}
          </button>

          {editItem && (
            <button
              className="btn btn-secondary mt-2 ms-2"
              onClick={() => {
                setEditItem(null);
                setReelId("");
              }}
            >
              Cancel
            </button>
          )}

          <hr />

          <h3>Saved Reels</h3>

          {reels?.map((r) => (
            <div key={r.id} className="p-3 mb-2 border rounded shadow-sm">
              <strong>{r.reel_id}</strong>

              <div className="mt-2 d-flex gap-2">
                <button
                  className="btn btn-success btn-sm"
                  onClick={() => setView(r.reel_id)}
                >
                  View
                </button>

                <button
                  className="btn btn-warning btn-sm"
                  onClick={() => startEdit(r.id, r.reel_id)}
                >
                  Edit
                </button>

                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => deleteReel(r.id)}
                >
                  Delete
                </button>

                <button
                  className="btn btn-dark btn-sm"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `https://www.instagram.com/reel/${r.reel_id}/`
                    );
                    toastSuccess("Copied!");
                  }}
                >
                  Copy Link
                </button>
              </div>
            </div>
          ))}

          {/* VIEW MODAL */}
          {view && (
            <div
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,.7)",
                backdropFilter: "blur(4px)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: 20,
                zIndex: 1000,
              }}
              onClick={() => setView(null)}
            >
              <div
                style={{
                  background: "white",
                  padding: 20,
                  borderRadius: 8,
                  width: "90%",
                  maxWidth: "600px",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="btn btn-danger mb-2"
                  onClick={() => setView(null)}
                  style={{ float: "right" }}
                >
                  Close
                </button>

                <InstaReelEmbed reelId={view} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReelUploader;
