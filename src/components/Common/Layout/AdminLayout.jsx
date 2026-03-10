import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../Navbar/navbar";
import SideBar from "../SideBar/sidebar";

const AdminLayout = ({ title = "Dashboard" }) => {
  return (
    <div className="container-fluid gauswarn-bg-color p-0 m-0">
      <Navbar title={title} />
      <div className="row m-0">
        <div className="col-lg-2 p-0">
          <SideBar />
        </div>
        <div className="col-lg-10 px-lg-5 d-flex justify-content-center flex-column">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
