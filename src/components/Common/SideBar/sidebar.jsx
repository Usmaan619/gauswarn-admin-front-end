import React, { useState, useEffect, useContext } from "react";
import "./sidebar.css";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { FiHome, FiLogOut, FiPackage, FiUsers, FiMessageSquare, FiMail, FiStar } from "react-icons/fi";
import { GoListUnordered } from "react-icons/go";
import { MdSlowMotionVideo, MdConnectWithoutContact } from "react-icons/md";
import { BiPhone } from "react-icons/bi";
import { PiFlagBannerFold } from "react-icons/pi";
import { LayoutPanelTop, RibbonIcon, Menu, X, ChevronLeft, ChevronRight } from "lucide-react";
import { IoNewspaperOutline } from "react-icons/io5";
import { UserContext } from "../../../Context/UserContext";
import Logo from "../../Assets/Images/Logo/logo.svg";

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { setUserLogin, userPermissions, setUserPermissions } = useContext(UserContext);

  const toggleSidebar = () => {
    if (window.innerWidth <= 1024) {
      setIsMobileOpen(!isMobileOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  const hasPermission = (required) => {
    if (!required) return true;
    if (!userPermissions) return false;
    return userPermissions.includes(required) || userPermissions.includes("all");
  };

  const gauswarnLinks = [
    { to: "/home", icon: FiHome, label: "Dashboard" },
    { to: "/order", icon: GoListUnordered, label: "Orders", permission: "orders" },
    { to: "/home-page-banner-change", icon: PiFlagBannerFold, label: "Home Banner", permission: "banners" },
    { to: "/reels-upload", icon: MdSlowMotionVideo, label: "Reels", permission: "reels" },
    { to: "/blog", icon: LayoutPanelTop, label: "Blogs", permission: "blogs" },
    { to: "/create-admin-user", icon: FiUsers, label: "Create Users", permission: "users" },
    { to: "/productinfo", icon: FiPackage, label: "Products", permission: "products" },
    { to: "/customer", icon: FiUsers, label: "Customers", permission: "customers" },
    { to: "/inquiry", icon: MdConnectWithoutContact, label: "B2B Inquiry", permission: "b2b" },
    { to: "/contact", icon: BiPhone, label: "Contact", permission: "contact" },
    { to: "/newlatter", icon: IoNewspaperOutline, label: "Newsletter", permission: "newsletter" },
    { to: "/offerBanner", icon: RibbonIcon, label: "Offer Banner", permission: "offerbanner" },
    { to: "/feedback", icon: FiStar, label: "Feedback", permission: "feedback" },
  ];

  const handleLogout = () => {
    localStorage.clear();
    setUserLogin(null);
    setUserPermissions([]);
    navigate("/login");
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setIsMobileOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <button 
        className="sidebar-mobile-toggle"
        onClick={toggleSidebar}
      >
        {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isMobileOpen && (
        <div className="sidebar-overlay" onClick={() => setIsMobileOpen(false)}></div>
      )}

      <aside className={`sidebar-main glass-card ${isCollapsed ? "collapsed" : ""} ${isMobileOpen ? "mobile-open" : ""}`}>
        <div className="sidebar-header">
          <div className="logo-wrapper">
            <img src={Logo} alt="GausWarn" className="sidebar-logo" />
            {!isCollapsed && <span className="logo-text glow-accent">GausWarn</span>}
          </div>
          <button className="collapse-btn" onClick={toggleSidebar}>
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-label">{!isCollapsed && "MAIN MENU"}</div>
          <div className="nav-links-container">
            {gauswarnLinks.map(({ to, icon: Icon, label, permission }) => {
              if (!hasPermission(permission)) return null;
              return (
                <NavLink 
                  key={to} 
                  to={to} 
                  className={({ isActive }) => `nav-link-item ${isActive ? "active" : ""}`}
                >
                  {({ isActive }) => (
                    <>
                      <Icon className="nav-icon" />
                      {!isCollapsed && <span className="nav-label">{label}</span>}
                      {isActive && !isCollapsed && <div className="active-dot glow-accent"></div>}
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        </nav>

        <div className="sidebar-footer">
          <button className="nav-link-item logout-btn-item" onClick={handleLogout}>
            <FiLogOut className="nav-icon text-danger" />
            {!isCollapsed && <span className="nav-label">Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
