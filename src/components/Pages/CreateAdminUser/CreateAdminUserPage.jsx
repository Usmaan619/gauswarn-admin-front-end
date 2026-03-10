import React from "react";
import GauswarnUsersTable from "./GauswarnUsersTable";
import { FiUsers } from "react-icons/fi";

const CreateAdminUserPage = () => {
  return (
    <div className="admin-users-page fade-in">
      <div className="page-header mb-4">
        <h2 className="glow-text d-flex align-items-center gap-2">
          <FiUsers className="text-info" />
          Admin User Management
        </h2>
        <p className="text-secondary">Create and manage administrative staff accounts and their permissions.</p>
      </div>

      <div className="glass-card p-4">
        <GauswarnUsersTable />
      </div>
    </div>
  );
};

export default CreateAdminUserPage;
