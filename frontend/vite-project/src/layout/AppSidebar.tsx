import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import {
  ChevronDownIcon,
  GridIcon,
  HorizontaLDots,
} from "../icons";
import { useSidebar } from "../context/SidebarContext";
import { useAuth } from "../context/AuthContext";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const navItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    subItems: [
      { name: "Produksi", path: "", pro: false },
    ],
  },
];

const othersItems: NavItem[] = [];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  useEffect(() => {
    let submenuMatched = false;
    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? navItems : othersItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as "main" | "others",
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [location, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  const handleLogout = async () => {
    try {
      await fetch("http://43.157.205.158:4000/auth/sign-out", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      await logout();
      navigate("/signin");
    }
  };

  const renderMenuItems = (items: NavItem[], menuType: "main" | "others") => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => {
        const isOpen = openSubmenu?.type === menuType && openSubmenu?.index === index;
        return (
          <li key={nav.name}>
            {nav.subItems ? (
              <button
                onClick={() => handleSubmenuToggle(index, menuType)}
                className={`menu-item group cursor-pointer ${
                  !isExpanded && !isHovered ? "lg:justify-center" : "lg:justify-start"
                }`}
                style={
                  isOpen
                    ? { backgroundColor: "#fff4ec", color: "#fd8f3f" }
                    : undefined
                }
              >
                <span
                  className="menu-item-icon-size"
                  style={{ color: isOpen ? "#fd8f3f" : undefined }}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
                {(isExpanded || isHovered || isMobileOpen) && (
                  <ChevronDownIcon
                    className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                    style={{ color: isOpen ? "#fd8f3f" : undefined }}
                  />
                )}
              </button>
            ) : (
              nav.path && (
                <Link
                  to={nav.path}
                  className="menu-item group"
                  style={
                    isActive(nav.path)
                      ? { backgroundColor: "#fff4ec", color: "#fd8f3f" }
                      : undefined
                  }
                >
                  <span
                    className="menu-item-icon-size"
                    style={{ color: isActive(nav.path) ? "#fd8f3f" : undefined }}
                  >
                    {nav.icon}
                  </span>
                  {(isExpanded || isHovered || isMobileOpen) && (
                    <span className="menu-item-text">{nav.name}</span>
                  )}
                </Link>
              )
            )}
            {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
              <div
                ref={(el) => {
                  subMenuRefs.current[`${menuType}-${index}`] = el;
                }}
                className="overflow-hidden transition-all duration-300"
                style={{
                  height: isOpen
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
                }}
              >
                <ul className="mt-2 space-y-1 ml-9">
                  {nav.subItems.map((subItem) => (
                    <li key={subItem.name}>
                      <Link
                        to={subItem.path}
                        className="menu-dropdown-item"
                        style={
                          isActive(subItem.path)
                            ? { color: "#fd8f3f", fontWeight: 600 }
                            : undefined
                        }
                      >
                        {subItem.name}
                        <span className="flex items-center gap-1 ml-auto">
                          {subItem.new && (
                            <span
                              className="ml-auto menu-dropdown-badge"
                              style={
                                isActive(subItem.path)
                                  ? { color: "#fd8f3f" }
                                  : undefined
                              }
                            >
                              new
                            </span>
                          )}
                          {subItem.pro && (
                            <span
                              className="ml-auto menu-dropdown-badge"
                              style={
                                isActive(subItem.path)
                                  ? { color: "#fd8f3f" }
                                  : undefined
                              }
                            >
                              pro
                            </span>
                          )}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );

  return (
    <aside
      className={`
        fixed top-0 left-0 px-3 z-50
        flex flex-col
        bg-white dark:bg-gray-900 dark:border-gray-800
        text-gray-900 border-r border-gray-200
        transition-all duration-300 ease-in-out
        mt-16 lg:mt-0
        h-[calc(100vh-4rem)] lg:h-screen
        ${
          isExpanded || isMobileOpen
            ? "w-[240px]"
            : isHovered
            ? "w-[240px]"
            : "w-[65px]"
        }
        ${isExpanded || isHovered || isMobileOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Logo */}
      <div
        className={`py-8 flex flex-shrink-0 ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link to="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <div className="flex items-center gap-2">
                <img
                  className="dark:hidden"
                  src="/images/logo/UTSG.png"
                  alt="Logo"
                  width={70}
                  height={40}
                />
                <span
                  className="text-black dark:text-white font-semibold text-lg"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                ></span>
              </div>
              <img
                className="hidden dark:block"
                src="/images/logo/UTSG.png"
                alt="Logo"
                width={50}
                height={40}
              />
            </>
          ) : (
            <img
              src="/images/logo/UTSG.png"
              alt="Logo"
              width={32}
              height={32}
            />
          )}
        </Link>
      </div>

      {/* Nav Menu — flex-1 + overflow-y-auto agar scroll tapi logout tetap di bawah */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Menu"
                ) : (
                  <HorizontaLDots className="size-6" />
                )}
              </h2>
              {renderMenuItems(navItems, "main")}
            </div>
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
                }`}
              ></h2>
              {renderMenuItems(othersItems, "others")}
            </div>
          </div>
        </nav>
      </div>

      {/* Logout Button — flex-shrink-0 agar tidak tertekan ke atas */}
      <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-800 py-4">
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-gray-600 dark:text-gray-400 transition-colors duration-200
            ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"}
          `}
          onMouseEnter={(e) => {
            const btn = e.currentTarget;
            btn.style.backgroundColor = "#fff4ec";
            btn.style.color = "#fd8f3f";
          }}
          onMouseLeave={(e) => {
            const btn = e.currentTarget;
            btn.style.backgroundColor = "";
            btn.style.color = "";
          }}
        >
          <span className="flex-shrink-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1"
              />
            </svg>
          </span>
          {(isExpanded || isHovered || isMobileOpen) && (
            <span className="text-sm font-medium">Logout</span>
          )}
        </button>
      </div>
    </aside>
  );
};

export default AppSidebar;