import React, { useState, useEffect, useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
// Common Components
import { clearCache, getItem } from "../../../Services/storage.service";
import "./navbar.css";

// Import Third Party Components
import { FaExchangeAlt, FaChevronDown } from "react-icons/fa";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

// images
import profile from "../../Assets/Images/navbar/User-60.svg";
import { UserContext } from "../../../Context/UserContext";


const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Check current route
  const isRajlaxmi = location.pathname.startsWith("/rajlaxmi");

  // Decide title and link dynamically
  const title = isRajlaxmi ? "Gauswarn Dashboard" : "Rajlaxmi Dashboard";
  const linkTo = isRajlaxmi ? "/home" : "/rajlaxmi";
  const { setUserLogin } = useContext(UserContext);

  const handleLogout = () => {
    clearCache("token");
    clearCache("email");
    clearCache("name");
    setUserLogin(null);
    navigate("/");
  };

  return (
    <div className="navbar-container">
      <div className="navbar-row d-flex flex-wrap justify-content-end align-items-center">
        {/* Switch button */}
        <NavLink to={linkTo} className="text-decoration-none">
          <div className={`dashboard-btn d-flex align-items-center me-3 ${isRajlaxmi ? "bg-dark-brown-color" : "bg-red-color"}`}>
            <FaExchangeAlt className="me-2" />
            <span>{title}</span>
          </div>
        </NavLink>

        {/* Profile button */}
        <button
          className="btn d-flex align-items-center profile-section"
          type="button"
          data-bs-toggle="modal"
          data-bs-target="#profileModal"
        >
          <img src={profile} alt="Profile" className="profile-img me-2" />
          <span className="username me-1 text-capitalize"> {getItem("name") ? getItem("name") : ""}</span>
          <FaChevronDown className="dropdown-icon" />
        </button>

        {/* Modal */}
        <div className="modal fade" id="profileModal" tabIndex="-1" aria-hidden="true">
          <div className="modal-dialog modal-sm modal-dialog-end">
            <div className="modal-content border-0 p-0">
              <ul className="list-unstyled mb-0">
                <li className="px-3 py-3 text-center">
                  <img src={profile} alt="avatar" className="rounded-circle mb-2" width="50" height="50" />
                  <h6 className="mb-0 text-uppercase"> {getItem("name") ? getItem("name") : ""}</h6>
                  <small className="text-muted">{getItem("email") ? getItem("email") : ""}</small>
                </li>
                <li><hr className="dropdown-divider m-0" /></li>
                <li className="text-center py-2">
                  <button
                    className={`btn shadow-none px-4 ${isRajlaxmi ? "logout-btn-orange" : "logout-btn-brown"}`}
                    onClick={handleLogout}
                    data-bs-dismiss="modal"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
