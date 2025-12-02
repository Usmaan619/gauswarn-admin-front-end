import React, { useState, useEffect } from "react";
import "./sidebar.css";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { FiHome, FiLogOut } from "react-icons/fi";
import { GoListUnordered } from "react-icons/go";
import { LiaTagSolid } from "react-icons/lia";
import { MdPeopleOutline } from "react-icons/md";
import { BiPhone } from "react-icons/bi";
import { FaRegCommentDots, FaBars } from "react-icons/fa6";
import Logo from "../../Assets/Images/Logo/logo.svg";
import LogoRajlaxmi from "../../Assets/Images/Logo/rajlaxmi.svg";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useContext } from "react";
import { UserContext } from "../../../Context/UserContext";

// ✅ default open if on tablet screen
const isTabletWidth = () =>
  typeof window !== "undefined" &&
  window.innerWidth >= 768 &&
  window.innerWidth <= 1024;

const Sidebar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(isTabletWidth());
  const [isCollapsed, setIsCollapsed] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const isRajlaxmi = location.pathname.includes("/rajlaxmi");
  const logoToShow = isRajlaxmi ? LogoRajlaxmi : Logo;

  const toggleSidebar = () => {
    if (window.innerWidth <= 1024) {
      setIsMobileOpen(!isMobileOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 768 && width <= 1024) {
        setIsMobileOpen(true); // ✅ keep open on tablets
        setIsCollapsed(false); // ensure not collapsed
      } else if (width > 1024) {
        setIsMobileOpen(false);
      } else {
        setIsMobileOpen(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { setUserLogin } = useContext(UserContext);

  const handleLogout = () => {
    localStorage.clear();
    setUserLogin(null);
    navigate("/login");
  };

  const rajlaxmiLinks = [
    { to: "/rajlaxmi", icon: FiHome, label: "Dashboard" },
    { to: "/rajlaxmi/order", icon: GoListUnordered, label: "Orders" },
    { to: "/rajlaxmi/product", icon: LiaTagSolid, label: "Products" },
    { to: "/rajlaxmi/customer", icon: MdPeopleOutline, label: "Customers" },
    { to: "/rajlaxmi/contact", icon: BiPhone, label: "Contact" },
    { to: "/rajlaxmi/feedback", icon: FaRegCommentDots, label: "Feedback" },
    { to: "/", icon: FiLogOut, label: "Logout" },
  ];

  const gauswarnLinks = [
    { to: "/home", icon: FiHome, label: "Dashboard" },
    { to: "/order", icon: GoListUnordered, label: "Orders" },
    { to: "/productinfo", icon: LiaTagSolid, label: "Products" },
    { to: "/customer", icon: MdPeopleOutline, label: "Customers" },
    { to: "/contact", icon: BiPhone, label: "Contact" },
    { to: "/feedback", icon: FaRegCommentDots, label: "Feedback" },
    { to: "/", icon: FiLogOut, label: "Logout" },
  ];

  const links = isRajlaxmi ? rajlaxmiLinks : gauswarnLinks;

  return (
    <>
      <button
        className={`mobile-toggle-btn ${isMobileOpen ? "tablet-open" : ""}`}
        onClick={toggleSidebar}
      >
        {isMobileOpen &&
        window.innerWidth <= 1024 &&
        window.innerWidth >= 768 ? (
          <IoIosArrowBack />
        ) : isMobileOpen ? (
          "✕"
        ) : (
          <FaBars />
        )}
      </button>

      <div
        className={`sidebar ${isCollapsed ? "collapsed" : ""} ${
          isMobileOpen ? "open" : ""
        } ${isRajlaxmi ? "bg-light-cream-color" : "gauswarn-bg-color"}`}
      >
        <div className="logo-container d-flex align-items-center justify-content-center">
          {!isCollapsed && (
            <img
              src={logoToShow}
              className={isRajlaxmi ? "rajlaxmi-logo" : "gauswarn-logo"}
              alt="Logo"
            />
          )}
          <button
            className={`desktop-toggle-btn ${
              isRajlaxmi ? "bg-light-cream-color" : "gauswarn-bg-color"
            }`}
            onClick={toggleSidebar}
          >
            {isCollapsed ? <IoIosArrowForward /> : <IoIosArrowBack />}
          </button>
        </div>

        <nav className="nav-links d-flex flex-column gap-2 mt-4">
          {links.map(({ to, icon: Icon, label }) => {
            const hoverClass = isRajlaxmi ? "rajlaxmi-hover" : "gauswarn-hover";

            if (label === "Logout") {
              return (
                <NavLink
                  key={to}
                  to={to}
                  end={to === (isRajlaxmi ? "/rajlaxmi" : "/")}
                  onClick={handleLogout}
                  className={({ isActive }) =>
                    `d-flex align-items-center gap-2 ${hoverClass} ${
                      isActive
                        ? isRajlaxmi
                          ? "active-rajlaxmi"
                          : "active-gauswarn"
                        : ""
                    }`
                  }
                >
                  <span className="icon">
                    <Icon />
                  </span>
                  {!isCollapsed && <span className="label">{label}</span>}
                </NavLink>
              );
            }

            return (
              <NavLink
                key={to}
                to={to}
                end={to === (isRajlaxmi ? "/rajlaxmi" : "/")}
                className={({ isActive }) =>
                  `d-flex align-items-center gap-2 ${hoverClass} ${
                    isActive
                      ? isRajlaxmi
                        ? "active-rajlaxmi"
                        : "active-gauswarn"
                      : ""
                  }`
                }
              >
                <span className="icon">
                  <Icon />
                </span>
                {!isCollapsed && <span className="label">{label}</span>}
              </NavLink>
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
