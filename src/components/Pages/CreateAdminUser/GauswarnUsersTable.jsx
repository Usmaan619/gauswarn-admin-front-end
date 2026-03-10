//

import React, { useEffect, useState } from "react";
import { getData, deleteDataNew } from "../../Common/APIs/api";
import Pagination from "react-bootstrap/Pagination";

import { toastError, toastSuccess } from "../../../Services/toast.service";
import CreateAdminUserModal from "./CreateAdminUserModal";
import { Search, UserPlus, Edit2, Trash2, Users } from "lucide-react";

const GauswarnUsersTable = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchUsers = async () => {
    try {
      const res = await getData("/getAllGauswarnUsers");
      if (res.success) setUsers(res.users);
    } catch {
      toastError("Error loading users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    await deleteDataNew(`/deleteUser/${id}`);
    toastSuccess("User deleted successfully");
    fetchUsers();
  };

  const filtered = users.filter((u) => {
    const q = searchQuery.toLowerCase();
    return (
      u.full_name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.mobile_number.includes(q)
    );
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const pageData = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div
      className="bg-white rounded-4 shadow-sm border-0"
      style={{ overflow: "hidden" }}
    >
      <div
        className="p-4 border-bottom"
        style={{
          background: "linear-gradient(135deg, #2f3e46 0%, #131523 100%)",
        }}
      >
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div className="d-flex align-items-center gap-3">
            <div
              className="rounded-circle p-3 shadow-sm"
              style={{ background: "#fefbe9" }}
            >
              <Users size={28} style={{ color: "#2f3e46" }} />
            </div>
            <div className="text-white">
              <h3 className="mb-1 fw-bold">Admin Users Management</h3>
              <p className="mb-0 small" style={{ opacity: 0.8 }}>
                Manage your admin users and their permissions
              </p>
            </div>
          </div>
          <button
            className="btn btn-lg shadow-sm d-flex align-items-center gap-2 fw-semibold"
            style={{ background: "#f7d486", color: "#131523", border: "none" }}
            onClick={() => {
              setEditUser(null);
              setShowModal(true);
            }}
          >
            <UserPlus size={20} />
            <span>Add Admin User</span>
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead style={{ background: "#f6f0e4" }}>
              <tr>
                <th
                  className="border-0 fw-semibold py-3 ps-4"
                  style={{ color: "#575757" }}
                >
                  ID
                </th>
                <th
                  className="border-0 fw-semibold py-3"
                  style={{ color: "#575757" }}
                >
                  Name
                </th>
                <th
                  className="border-0 fw-semibold py-3"
                  style={{ color: "#575757" }}
                >
                  Email
                </th>
                <th
                  className="border-0 fw-semibold py-3"
                  style={{ color: "#575757" }}
                >
                  Mobile
                </th>
                <th
                  className="border-0 fw-semibold py-3"
                  style={{ color: "#575757" }}
                >
                  Role
                </th>
                <th
                  className="border-0 fw-semibold py-3"
                  style={{ color: "#575757" }}
                >
                  Permissions
                </th>
                <th
                  className="border-0 fw-semibold py-3 text-center"
                  style={{ color: "#575757" }}
                >
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {pageData.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-5">
                    <div className="text-secondary opacity-50"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="150" width="150" xmlns="http://www.w3.org/2000/svg"><path d="M490.8 459.1L248.6 209.6c-4.6-4.8-12-5-16.8-.4-4.8 4.6-5 12-.4 16.8L473.6 475.5c4.7 4.9 12 5.1 16.9.4 4.8-4.7 5.1-12 .3-16.8zM245.8 196.5l-4-4.2C188.7 136.2 113.3 103.3 35.5 103.3c-6.6 0-12 5.4-12 12s5.4 12 12 12c58.2 0 112 18 152.1 50.8l.2.2 45.4 46.8-93.5 96.6c-11.8-8.2-26.6-13.1-42.5-13.1-39.7 0-72 32.3-72 72s32.3 72 72 72 72-32.3 72-72c0-10.4-2.2-20.2-6.1-29.1l80-82.6c13.7 12.3 22.3 30.2 22.3 50.1 0 37.5-30.5 68-68 68h-112c-6.6 0-12 5.4-12 12s5.4 12 12 12h112c50.8 0 92-41.2 92-92 0-30.3-14.7-57.2-37.4-74.4l30.2-31.2z"></path></svg></div>
                    <h4 style={{ color: "#707070" }}>No Users Found</h4>
                  </td>
                </tr>
              ) : (
                pageData.map((u) => (
                  <tr key={u.id} className="border-bottom">
                    <td className="ps-4">{u.id}</td>
                    <td>{u.full_name}</td>
                    <td>{u.email}</td>
                    <td>{u.mobile_number}</td>
                    <td>{u.role}</td>

                    <td>
                      <div className="d-flex flex-wrap gap-1">
                        {(() => {
                          try {
                            const perms = JSON.parse(u.permissions || "[]");
                            return perms.map((p) => (
                              <span
                                key={p}
                                className="badge px-2 py-1"
                                style={{
                                  background: "#c5ebaa",
                                  color: "#2f3e46",
                                  fontSize: "0.75rem",
                                  border: "1px solid #2f3e46",
                                }}
                              >
                                {p}
                              </span>
                            ));
                          } catch {
                            return null;
                          }
                        })()}
                      </div>
                    </td>

                    <td>
                      <div className="d-flex gap-2 justify-content-center">
                        <button
                          className="btn btn-sm"
                          style={{ background: "#b5e2fa", border: "none" }}
                          onClick={() => {
                            setEditUser(u);
                            setShowModal(true);
                          }}
                        >
                          <Edit2 size={16} /> Edit
                        </button>

                        <button
                          className="btn btn-sm"
                          style={{
                            background: "#e07a5f",
                            color: "white",
                            border: "none",
                          }}
                          onClick={() => deleteUser(u.id)}
                        >
                          <Trash2 size={16} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="d-flex justify-content-center mt-4">
            <Pagination className="mb-0">
              <Pagination.Prev
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              />
              {Array.from({ length: totalPages }, (_, i) => (
                <Pagination.Item
                  key={i}
                  active={currentPage === i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              />
            </Pagination>
          </div>
        )}
      </div>

      <CreateAdminUserModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={fetchUsers}
        editUser={editUser}
      />
    </div>
  );
};

export default GauswarnUsersTable;
