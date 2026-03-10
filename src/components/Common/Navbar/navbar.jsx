import React, { useState, useContext } from "react";
import "./navbar.css";
import { FiSearch, FiBell, FiSettings, FiMoon, FiSun, FiUser, FiChevronDown } from "react-icons/fi";
import { UserContext } from "../../../Context/UserContext";
import { getItem } from "../../../Services/storage.service";

const Navbar = ({ title, isSidebarCollapsed }) => {
  const { setUserLogin } = useContext(UserContext);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showProfile, setShowProfile] = useState(false);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  return (
    <header className="navbar-glass glass-card">
      <div className="navbar-left">
        <h1 className="page-title">{title}</h1>
      </div>

      <div className="navbar-right">
        <div className="search-bar-wrapper glass-card">
          <FiSearch className="search-icon" />
          <input type="text" placeholder="Search insights..." className="search-input" />
        </div>

        <div className="nav-actions">
          <button className="nav-action-btn" onClick={toggleTheme} title="Toggle Dark/Light Mode">
            {isDarkMode ? <FiSun /> : <FiMoon />}
          </button>
          
          <div className="notification-wrapper">
            <button className="nav-action-btn" title="Notifications">
              <FiBell />
              <span className="notification-dot glow-accent"></span>
            </button>
          </div>

          <button className="nav-action-btn" title="Settings">
            <FiSettings />
          </button>
        </div>

        <div className="profile-dropdown-wrapper">
          <button className="profile-btn glass-card" onClick={() => setShowProfile(!showProfile)}>
            <div className="avatar glow-accent">
              <FiUser />
            </div>
            <span className="username">{getItem("name") || "Admin"}</span>
            <FiChevronDown />
          </button>

          {showProfile && (
            <div className="profile-dropdown-menu glass-card fade-in">
              <div className="dropdown-header">
                <span className="email-text">{getItem("email") || "admin@gauswarn.com"}</span>
              </div>
              <ul className="dropdown-items">
                <li><FiUser /> My Profile</li>
                <li><FiSettings /> Account Settings</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
