import React, { useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
// Common Components
import { clearCache, getItem } from "../../../Services/storage.service";
import "./navbar.css";

// Import Third Party Components
import { FaChevronDown } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";

// images

import { UserContext } from "../../../Context/UserContext";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Check current route
  const isRajlaxmi = location.pathname.startsWith("/rajlaxmi");


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
        {/* Profile button */}
        <button
          className="btn d-flex align-items-center profile-section"
          type="button"
          data-bs-toggle="modal"
          data-bs-target="#profileModal"
        >
          <div className="bg-light rounded-circle d-flex align-items-center justify-content-center border" style={{width: "40px", height: "40px", marginRight: "10px"}}><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 448 512" height="20" width="20" xmlns="http://www.w3.org/2000/svg"><path d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z"></path></svg></div>
          <span className="username me-1 text-capitalize">
            {" "}
            {getItem("name") ? getItem("name") : ""}
          </span>
          <FaChevronDown className="dropdown-icon" />
        </button>

        {/* Modal */}
        <div
          className="modal fade"
          id="profileModal"
          tabIndex="-1"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-sm modal-dialog-end">
            <div className="modal-content border-0 p-0">
              <ul className="list-unstyled mb-0">
                <li className="px-3 py-3 text-center">
                  <div className="bg-light rounded-circle d-flex align-items-center justify-content-center border" style={{width: "40px", height: "40px", marginRight: "10px"}}><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 448 512" height="20" width="20" xmlns="http://www.w3.org/2000/svg"><path d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z"></path></svg></div>
                  <h6 className="mb-0 text-uppercase">
                    {" "}
                    {getItem("name") ? getItem("name") : ""}
                  </h6>
                  <small className="text-muted">
                    {getItem("email") ? getItem("email") : ""}
                  </small>
                </li>
                <li>
                  <hr className="dropdown-divider m-0" />
                </li>
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
