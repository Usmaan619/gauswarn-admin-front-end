import React, { useState, useEffect, useContext } from "react";
import "./sidebar.css";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { FiHome, FiLogOut } from "react-icons/fi";
import { GoListUnordered } from "react-icons/go";
import { LiaTagSolid } from "react-icons/lia";
import {
  MdConnectWithoutContact,
  MdPeopleOutline,
  MdSlowMotionVideo,
} from "react-icons/md";
import { BiPhone } from "react-icons/bi";
import { FaRegCommentDots, FaBars, FaUsers } from "react-icons/fa6";
import Logo from "../../Assets/Images/Logo/logo.svg";
import LogoRajlaxmi from "../../Assets/Images/Logo/rajlaxmi.svg";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { UserContext } from "../../../Context/UserContext";
import { PiFlagBannerFold } from "react-icons/pi";
import { LayoutPanelTop, RibbonIcon } from "lucide-react";
import { IoNewspaperOutline } from "react-icons/io5";

// default open if on tablet screen
const isTabletWidth = () =>
  typeof window !== "undefined" &&
  window.innerWidth >= 768 &&
  window.innerWidth <= 1024;

const Sidebar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(isTabletWidth());
  const [isCollapsed, setIsCollapsed] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const { setUserLogin, userPermissions, setUserPermissions } =
    useContext(UserContext);

  const isRajlaxmi = location.pathname.includes("/rajlaxmi");
  const logoToShow = isRajlaxmi ? LogoRajlaxmi : Logo;

  const toggleSidebar = () => {
    if (window.innerWidth <= 1024) {
      setIsMobileOpen(!isMobileOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  // 🔥 PERMISSION CHECKER
  const hasPermission = (required) => {
    if (!required) return true;
    if (!userPermissions) return false;
    return (
      userPermissions.includes(required) || userPermissions.includes("all") // super admin
    );
  };

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 768 && width <= 1024) {
        setIsMobileOpen(true);
        setIsCollapsed(false);
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

  const handleLogout = () => {
    //  localStorage clear karo
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("name");
    localStorage.removeItem("permissions");

    //  Context values reset karo
    setUserLogin(null);
    setUserPermissions([]);

    // Navigate to login
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

  // const gauswarnLinks = [
  //   { to: "/home", icon: FiHome, label: "Dashboard" },
  //   {
  //     to: "/order",
  //     icon: GoListUnordered,
  //     label: "Orders",
  //     permission: "orders",
  //   },
  //   {
  //     to: "/home-page-banner-change",
  //     icon: PiFlagBannerFold,
  //     label: "Home Banner",
  //     permission: "orders",
  //   },
  //   {
  //     to: "/reels-upload",
  //     icon: MdSlowMotionVideo,
  //     label: "Reels",
  //     permission: "reel",
  //   },
  //   {
  //     to: "/blog",
  //     icon: LayoutPanelTop,
  //     label: "Blogs",
  //     permission: "blogs",
  //   },
  //   {
  //     to: "/create-admin-user",
  //     icon: FaUsers,

  //     permission: "orders",
  //     label: "Create Users",
  //   },
  //   {
  //     to: "/productinfo",
  //     icon: LiaTagSolid,

  //     permission: "orders",
  //     label: "Products",
  //   },
  //   {
  //     to: "/customer",
  //     icon: MdPeopleOutline,

  //     permission: "orders",
  //     label: "Customers",
  //   },
  //   {
  //     to: "/inquiry",
  //     icon: MdConnectWithoutContact,

  //     permission: "orders",
  //     label: "B2B Inquiry",
  //   },
  //   {
  //     to: "/contact",
  //     icon: BiPhone,

  //     permission: "orders",
  //     label: "Contact",
  //   },
  //   {
  //     to: "/feedback",
  //     icon: FaRegCommentDots,

  //     permission: "orders",
  //     label: "Feedback",
  //   },
  //   {
  //     to: "/",
  //     icon: FiLogOut,

  //     permission: "orders",
  //     label: "Logout",
  //   },
  // ];
  const gauswarnLinks = [
    { to: "/home", icon: FiHome, label: "Dashboard" },

    {
      to: "/order",
      icon: GoListUnordered,
      label: "Orders",
      permission: "orders",
    },

    {
      to: "/home-page-banner-change",
      icon: PiFlagBannerFold,
      label: "Home Banner",
      permission: "banners",
    },

    {
      to: "/reels-upload",
      icon: MdSlowMotionVideo,
      label: "Reels",
      permission: "reels",
    },

    {
      to: "/blog",
      icon: LayoutPanelTop,
      label: "Blogs",
      permission: "blogs",
    },

    {
      to: "/create-admin-user",
      icon: FaUsers,
      label: "Create Users",
      permission: "users",
    },

    {
      to: "/productinfo",
      icon: LiaTagSolid,
      label: "Products",
      permission: "products",
    },

    {
      to: "/customer",
      icon: MdPeopleOutline,
      label: "Customers",
      permission: "customers",
    },

    {
      to: "/inquiry",
      icon: MdConnectWithoutContact,
      label: "B2B Inquiry",
      permission: "b2b",
    },

    {
      to: "/contact",
      icon: BiPhone,
      label: "Contact",
      permission: "contact",
    },

    {
      to: "/newlatter",
      icon: IoNewspaperOutline,
      label: "Newlatter",
      permission: "newsletter",
    },
    {
      to: "/offerBanner",
      icon: RibbonIcon,
      label: "Offer Banner",
      permission: "offerbanner",
    },

    {
      to: "/feedback",
      icon: FaRegCommentDots,
      label: "Feedback",
      permission: "feedback",
    },

    {
      to: "/",
      icon: FiLogOut,
      label: "Logout",
    },
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
          {links.map(({ to, icon: Icon, label, permission }) => {
            if (!hasPermission(permission)) return null;

            const hoverClass = isRajlaxmi ? "rajlaxmi-hover" : "gauswarn-hover";

            return (
              <NavLink
                key={to}
                to={to}
                onClick={label === "Logout" ? handleLogout : undefined}
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
