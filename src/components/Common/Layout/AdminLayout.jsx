import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../Navbar/navbar";
import Sidebar from "../SideBar/sidebar";
import "../../../styles/design-system.css";

const AdminLayout = ({ title = "Dashboard" }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="admin-main-wrapper gauswarn-bg-color">
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        setIsCollapsed={setIsSidebarCollapsed} 
      />
      <div 
        className={`admin-content-area ${isSidebarCollapsed ? "sidebar-collapsed" : ""}`}
      >
        <Navbar 
          title={title} 
          isSidebarCollapsed={isSidebarCollapsed}
        />
        <main className="dashboard-content fade-in mt-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
