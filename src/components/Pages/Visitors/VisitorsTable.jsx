import React from "react";
import { deleteDataNew } from "../../Common/APIs/api";
import { toastSuccess, toastError, toastInfo } from "../../../Services/toast.service";
import { Trash2, Copy } from "lucide-react";

const VisitorsTable = ({ visitors, loading, refresh }) => {
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this visitor? You won't be able to revert this!")) {
      try {
        const response = await deleteDataNew(`/delete-visitor/${id}`);
        if (response.success) {
          toastSuccess("Visitor has been deleted.");
          refresh();
        } else {
          toastError("Something went wrong while deleting.");
        }
      } catch (error) {
        console.error("Delete Error:", error);
        toastError("Something went wrong while deleting.");
      }
    }
  };

  const handleClearAll = async () => {
    if (window.confirm("Are you sure? This will delete ALL visitor data!")) {
      try {
        const response = await deleteDataNew(`/clear-visitors`);
        if (response.success) {
          toastSuccess("All visitor data has been deleted.");
          refresh();
        } else {
          toastError("Something went wrong while clearing.");
        }
      } catch (error) {
        console.error("Clear All Error:", error);
        toastError("Something went wrong while clearing.");
      }
    }
  };

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toastInfo(`${text} copied to clipboard`);
  };

  return (
    <div className="card shadow-sm border-0 rounded-3 overflow-hidden mt-4">
      <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center border-bottom">
        <h5 className="mb-0 fw-bold text-dark">Website Visitors</h5>
        <button
          className="btn btn-outline-danger btn-sm rounded-pill px-3"
          onClick={handleClearAll}
          disabled={visitors.length === 0}
        >
          Clear All
        </button>
      </div>
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light text-secondary text-uppercase small fw-bold">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">IP Address</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Device/Browser</th>
                <th className="px-4 py-3">Page URL</th>
                <th className="px-4 py-3">Visit Time</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="border-top-0">
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </td>
                </tr>
              ) : visitors.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-5 text-muted">
                    No visitors track yet.
                  </td>
                </tr>
              ) : (
                visitors.map((visitor) => (
                  <tr key={visitor.id}>
                    <td className="px-4 py-3 text-muted">#{visitor.id}</td>
                    <td className="px-4 py-3 fw-medium text-dark">
                      {visitor.ip_address}
                    </td>
                    <td className="px-4 py-3">
                      <span className="d-block text-dark fw-normal">
                        {visitor.city}
                      </span>
                      <small className="text-muted text-uppercase">
                        {visitor.country}
                      </small>
                    </td>
                    <td className="px-4 py-3">
                      <span className="badge bg-soft-primary text-primary border border-primary-subtle rounded-pill me-1">
                        {visitor.device}
                      </span>
                      <span className="text-muted small">{visitor.browser}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div
                        className="text-truncate"
                        style={{ maxWidth: "200px" }}
                        title={visitor.page_url}
                      >
                        <a
                          href={visitor.page_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-decoration-none text-primary"
                        >
                          {visitor.page_url}
                        </a>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted small">
                      {formatDate(visitor.visit_time)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="d-flex justify-content-center gap-2">
                        <button
                          className="btn btn-light btn-sm rounded-circle p-2"
                          onClick={() => copyToClipboard(visitor.ip_address)}
                          title="Copy IP"
                        >
                          <Copy size={16} className="text-primary" />
                          <span className="small d-none d-lg-inline ms-1 text-primary">Copy</span>
                        </button>
                        <button
                          className="btn btn-light btn-sm rounded-circle p-2"
                          onClick={() => handleDelete(visitor.id)}
                          title="Delete Visitor"
                        >
                          <Trash2 size={16} className="text-danger" />
                          <span className="small d-none d-lg-inline ms-1 text-danger">Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VisitorsTable;
