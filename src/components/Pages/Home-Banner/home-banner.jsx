import React, { useEffect, useState } from "react";
import Sidebar from "../../Common/SideBar/sidebar";
import Navbar from "../../Common/Navbar/navbar";
import { getData, postFormData } from "../../Common/APIs/api";
import { toastSuccess } from "../../../Services/toast.service";

const BannerManager = () => {
  const [banners, setBanners] = useState({
    banner1: null,
    banner2: null,
    banner3: null,
    banner4: null,
  });
  const [uploading, setUploading] = useState(null);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const res = await getData("home-banners");
      if (res) setBanners(res);
    } catch (err) {
      console.log(err);
    }
  };

  const updateBanner = async (slot, file) => {
    if (!file) return;

    setUploading(slot);
    const formData = new FormData();
    formData.append("slots", slot);
    formData.append("banner", file);

    try {
      const res = await postFormData("/home-banners-images", formData);
      if (res?.data?.updated) {
        toastSuccess(`Banner ${slot} updated successfully!`);
        fetchBanners();
      }
    } catch (err) {
      console.log(err);
    } finally {
      setUploading(null);
    }
  };

  return (
    <div className="container-fluid px-4 gauswarn-bg-color min-vh-100">
      <Navbar />
      <div className="row">
        <div className="col-lg-2">
          <Sidebar />
        </div>

        <div className="col-lg-10 px-lg-5 py-4">
          {/* Page Header */}
          <div className="mb-5">
            <div className="d-flex align-items-center mb-2">
              {/* <div className="rounded-circle p-3 me-3" style={{background: 'linear-gradient(135deg, #e07a5f 0%, #e07a5f 100%)'}}>
                <i className="bi bi-images text-white" style={{fontSize: '1.5rem'}}></i>
              </div> */}
              <div>
                <h2 className="fw-bold text-dark mb-1">Homepage Banners</h2>
                <p className="text-muted mb-0">
                  Manage your website's promotional banners
                </p>
              </div>
            </div>
          </div>

          {/* Banner Grid */}
          <div className="row g-4">
            {[1, 2, 3, 4].map((slot) => (
              <div key={slot} className="col-md-6 col-xl-3">
                <div
                  className="card shadow-sm border-0 h-100 overflow-hidden hover-lift"
                  style={{ transition: "transform 0.2s" }}
                >
                  {/* Card Header */}
                  <div
                    className="card-header text-white py-3 position-relative"
                    style={{
                      background:
                        "linear-gradient(135deg, #5d4037 0%, #5d4037 100%)",
                    }}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <h6 className="mb-0 fw-semibold">
                        <i className="bi bi-card-image me-2"></i>
                        Banner {slot}
                      </h6>
                      {banners[`banner${slot}`] && (
                        <span className="badge bg-success bg-opacity-25 text-success border border-success">
                          <i className="bi bi-check-circle-fill me-1"></i>
                          Active
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="card-body p-0">
                    {/* Image Preview */}
                    <div
                      className="position-relative bg-light"
                      style={{ height: "200px" }}
                    >
                      {banners[`banner${slot}`] ? (
                        <>
                          <img
                            src={banners[`banner${slot}`]}
                            alt={`banner-${slot}`}
                            className="w-100 h-100"
                            style={{ objectFit: "cover" }}
                          />
                          <div
                            className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-0 d-flex align-items-center justify-content-center"
                            style={{ transition: "opacity 0.3s" }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.opacity = "0.7")
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.opacity = "0")
                            }
                          >
                            <i
                              className="bi bi-zoom-in text-white"
                              style={{ fontSize: "2rem" }}
                            ></i>
                          </div>
                        </>
                      ) : (
                        <div className="d-flex flex-column justify-content-center align-items-center h-100 text-muted">
                          <i
                            className="bi bi-image"
                            style={{ fontSize: "3rem", opacity: 0.3 }}
                          ></i>
                          <p className="mb-0 mt-2 small">No banner uploaded</p>
                        </div>
                      )}
                    </div>

                    {/* Upload Button Section */}
                    <div className="p-3 bg-light">
                      <input
                        type="file"
                        id={`banner-${slot}`}
                        accept="image/*"
                        className="d-none"
                        onChange={(e) => updateBanner(slot, e.target.files[0])}
                        disabled={uploading === slot}
                      />

                      <button
                        onClick={() =>
                          document.getElementById(`banner-${slot}`).click()
                        }
                        className="btn w-100 shadow-sm position-relative overflow-hidden"
                        style={{
                          background:
                            uploading === slot
                              ? "#6c757d"
                              : "linear-gradient(135deg, #e07a5f 0%, #e07a5f 100%)",
                          color: "white",
                          border: "none",
                          transition: "all 0.3s",
                        }}
                        disabled={uploading === slot}
                      >
                        {uploading === slot ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Uploading...
                          </>
                        ) : (
                          <>
                            <i
                              className={`bi ${
                                banners[`banner${slot}`]
                                  ? "bi-arrow-repeat"
                                  : "bi-cloud-upload"
                              } me-2`}
                            ></i>
                            {banners[`banner${slot}`]
                              ? "Replace Banner"
                              : "Upload Banner"}
                          </>
                        )}
                      </button>

                      {banners[`banner${slot}`] && (
                        <small className="text-muted d-block mt-2 text-center">
                          <i className="bi bi-info-circle me-1"></i>
                          Click to replace current banner
                        </small>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Info Card */}
          <div
            className="card border-0 shadow-sm mt-4"
            style={{
              background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
            }}
          >
            <div className="card-body p-4">
              <div className="row align-items-center">
                <div className="col-md-1 text-center">
                  <i
                    className="bi bi-lightbulb text-warning"
                    style={{ fontSize: "2rem" }}
                  ></i>
                </div>
                <div className="col-md-11">
                  <h6 className="fw-semibold mb-2">Banner Guidelines</h6>
                  <p className="mb-0 small text-muted">
                    <i className="bi bi-check-circle-fill text-success me-2"></i>
                    Recommended dimensions: 1,441×580px for best quality
                    <br />
                    <i className="bi bi-check-circle-fill text-success me-2"></i>
                    Supported formats: JPG, PNG, WebP
                    <br />
                    <i className="bi bi-check-circle-fill text-success me-2"></i>
                    Maximum file size: 10MB
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .hover-lift:hover {
          transform: translateY(-5px);
        }
      `}</style>
    </div>
  );
};

export default BannerManager;
