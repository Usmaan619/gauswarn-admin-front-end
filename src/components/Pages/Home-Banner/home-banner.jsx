import React, { useEffect, useState, useCallback } from "react";
import { getData, postFormData } from "../../Common/APIs/api";
import { toastSuccess, toastError } from "../../../Services/toast.service";
import { FiImage, FiUpload, FiCheckCircle, FiAlertCircle, FiInfo } from "react-icons/fi";

const BannerManager = () => {
  const [banners, setBanners] = useState({
    banner1: null,
    banner2: null,
    banner3: null,
    banner4: null,
  });
  const [uploading, setUploading] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getData("home-banners");
      if (res) {
        setBanners({
          banner1: res.banner1 || null,
          banner2: res.banner2 || null,
          banner3: res.banner3 || null,
          banner4: res.banner4 || null,
        });
      }
    } catch (err) {
      console.error("Failed to fetch banners:", err);
      toastError("Failed to load banners");
    } finally {
      setLoading(false);
    }
  }, []);

  const validateFile = (file) => {
    const maxSize = 10 * 1024 * 1024;
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      toastError("Please select JPG, PNG, or WebP images only");
      return false;
    }

    if (file.size > maxSize) {
      toastError("File size must be less than 10MB");
      return false;
    }

    return true;
  };

  const updateBanner = async (slot, file) => {
    if (!file || !validateFile(file)) return;

    setUploading(slot);

    try {
      const formData = new FormData();
      formData.append("slots", slot);
      formData.append("banner", file);

      const res = await postFormData("/home-banners-images", formData);

      if (res?.data?.updated || res?.data?.newUrl) {
        toastSuccess(`Banner ${slot} updated successfully!`);
        await fetchBanners();
      } else {
        toastError("Failed to update banner");
      }
    } catch (err) {
      console.error(`Banner ${slot} update failed:`, err);
      const errorMsg = err?.message || "Upload failed. Please try again.";
      toastError(errorMsg);
    } finally {
      setUploading(null);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-info" role="status"></div>
        <p className="mt-3 text-secondary">Synchronizing banners...</p>
      </div>
    );
  }

  return (
    <div className="banner-manager-page fade-in">
      <div className="page-header mb-4">
        <h2 className="glow-text d-flex align-items-center gap-2">
          <FiImage className="text-info" />
          Homepage Banners
        </h2>
        <p className="text-secondary">Control the primary visual assets of your website's main landing page.</p>
      </div>

      <div className="row g-4 mb-4">
        {[1, 2, 3, 4].map((slot) => {
          const isUploading = uploading === slot;
          const bannerUrl = banners[`banner${slot}`];
          const hasBanner = !!bannerUrl;

          return (
            <div key={slot} className="col-md-6 col-xl-3">
              <div className="glass-card h-100 overflow-hidden d-flex flex-column">
                <div className="p-3 border-bottom border-light d-flex justify-content-between align-items-center">
                  <span className="fw-bold small uppercase">Slot {slot}</span>
                  {hasBanner ? 
                    <FiCheckCircle className="text-success" /> : 
                    <FiAlertCircle className="text-warning" />
                  }
                </div>
                
                <div className="flex-grow-1 p-3">
                  <div className="banner-preview-box rounded-3 glass-card mb-3 overflow-hidden" 
                       style={{ height: '160px', background: 'rgba(255,255,255,0.02)' }}>
                    {hasBanner ? (
                      <img src={bannerUrl} alt={`Banner ${slot}`} className="w-100 h-100" style={{ objectFit: 'cover' }} />
                    ) : (
                      <div className="d-flex flex-column align-items-center justify-content-center h-100 opacity-20">
                         <FiImage size={40} />
                         <span className="small mt-2">No Image</span>
                      </div>
                    )}
                  </div>

                  <input
                    type="file"
                    id={`banner-file-${slot}`}
                    className="d-none"
                    onChange={(e) => updateBanner(slot, e.target.files[0])}
                  />
                  
                  <button 
                    className={`btn w-100 py-2 d-flex align-items-center justify-content-center gap-2 ${hasBanner ? 'btn-outline-info' : 'btn-info'}`}
                    onClick={() => document.getElementById(`banner-file-${slot}`).click()}
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <div className="spinner-border spinner-border-sm" role="status"></div>
                    ) : (
                      <FiUpload size={16} />
                    )}
                    {isUploading ? "Uploading..." : hasBanner ? "Replace Image" : "Upload Banner"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="glass-card p-4 d-flex align-items-start gap-3">
        <div className="p-3 rounded-circle" style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
          <FiInfo className="text-info" size={24} />
        </div>
        <div>
          <h5 className="text-white mb-2">Technical Specifications</h5>
          <div className="row g-3 mt-1">
             <div className="col-auto">
               <span className="badge glass-card px-3 py-2 text-secondary fw-normal">Resolution: <strong className="text-white">1441 × 580px</strong></span>
             </div>
             <div className="col-auto">
               <span className="badge glass-card px-3 py-2 text-secondary fw-normal">Max Size: <strong className="text-white">10 MB</strong></span>
             </div>
             <div className="col-auto">
               <span className="badge glass-card px-3 py-2 text-secondary fw-normal">Formats: <strong className="text-white">JPG, PNG, WebP</strong></span>
             </div>
             <div className="col-auto">
               <span className="badge glass-card px-3 py-2 text-secondary fw-normal">Aspect Ratio: <strong className="text-white">Landscape</strong></span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerManager;
