import { useEffect, useRef, useState } from "react";
import { useSidebar } from "../context/SidebarContext";
import { ThemeToggleButton } from "../components/common/ThemeToggleButton";

interface AppHeaderProps {
  selectedPT: string;
  onPTChange: (pt: string) => void;
  currentActivity?: string;
  onActivityChange?: (activity: string) => void;
  apiUrl?: string;
  year?: number;
  activeTab?: string;
  onUnitActivityChange?: (activity: string) => void;
}

interface MonthlyData {
  month: string;
  value: number;
}

interface ActivityData {
  [activityName: string]: MonthlyData[];
}

interface SiteData {
  [siteName: string]: ActivityData;
}

interface ApiResponse {
  success: boolean;
  year: number;
  data: SiteData;
}

const ACTIVITY_ICONS: Record<string, string> = {
  // Loading hauling
  "loading hauling": "https://img.icons8.com/ios/50/dump-truck.png",
  "loading_hauling": "https://img.icons8.com/ios/50/dump-truck.png",

  // Drilling
  "drilling": "https://img.icons8.com/material/24/drilled-well.png",

  // Perintisan Used
  "perintisan used": "https://img.icons8.com/ios/50/flag--v1.png",
  "perintisan_used": "https://img.icons8.com/ios/50/flag--v1.png",

  // Perintisan New
  "perintisan new": "https://img.icons8.com/ios/50/map-marker--v1.png",
  "perintisan_new": "https://img.icons8.com/ios/50/map-marker--v1.png",

  // Breaker
  "breaker": "https://img.icons8.com/ios/50/lime-stone.png",

  // Bulldozer New
  "buldozzer new": "https://img.icons8.com/ios/50/bulldozer.png",
  "buldozzer_new": "https://img.icons8.com/ios/50/bulldozer.png",
  "bulldozer new": "https://img.icons8.com/ios/50/bulldozer.png",
  "bulldozer_new": "https://img.icons8.com/ios/50/bulldozer.png",

  // Bulldozer Used
  "buldozzer used": "https://img.icons8.com/ios-filled/50/bulldozer.png",
  "buldozzer_used": "https://img.icons8.com/ios-filled/50/bulldozer.png",
  "bulldozer used": "https://img.icons8.com/ios-filled/50/bulldozer.png",
  "bulldozer_used": "https://img.icons8.com/ios-filled/50/bulldozer.png",

  // OB Rehandle
  "ob rehandle": "https://img.icons8.com/ios/50/portraits.png",
  "ob_rehandle": "https://img.icons8.com/ios/50/portraits.png",

  // OB Insitu
  "ob institiu": "https://img.icons8.com/ios/50/chevron-right.png",
  "ob_institiu": "https://img.icons8.com/ios/50/chevron-right.png",
  "ob insitu": "https://img.icons8.com/ios/50/chevron-right.png",
  "ob_insitu": "https://img.icons8.com/ios/50/chevron-right.png",

  // ER
  "er": "https://img.icons8.com/ios/50/harvester.png",

  // PPO Direct
  "ppo direct": "https://img.icons8.com/ios/50/gears--v1.png",
  "ppo_direct": "https://img.icons8.com/ios/50/gears--v1.png",

  // Cut & Fill
  "cut & fill": "https://img.icons8.com/ios/50/golden-fever.png",
  "cut_&_fill": "https://img.icons8.com/ios/50/golden-fever.png",
  "cut and fill": "https://img.icons8.com/ios/50/golden-fever.png",
  "cut_and_fill": "https://img.icons8.com/ios/50/golden-fever.png",
  "cut & fills": "https://img.icons8.com/ios/50/golden-fever.png",

  // Stock
  "stock": "https://img.icons8.com/ios/50/stocks--v1.png",
};

const getActivityIcon = (activityName: string): string | null => {
  const key = activityName.toLowerCase().trim();
  return ACTIVITY_ICONS[key] ?? null;
};

const ActivityIcon = ({ activity, isActive }: { activity: string; isActive: boolean }) => {
  const iconUrl = getActivityIcon(activity);

  if (iconUrl) {
    return (
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${!isActive ? "bg-gray-100 dark:bg-gray-700" : ""}`}
        style={isActive ? { backgroundColor: "#fd8f3f" } : {}}
      >
        <img
          src={iconUrl}
          alt={activity}
          width={14}
          height={14}
          style={isActive ? { filter: "brightness(0) invert(1)" } : { filter: "brightness(0) invert(0.5)" }}
        />
      </div>
    );
  }

  // Fallback icon (svg lama)
  return (
    <div
      className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${!isActive ? "bg-gray-100 dark:bg-gray-700" : ""}`}
      style={isActive ? { backgroundColor: "#fd8f3f" } : {}}
    >
      <svg
        width="12" height="12" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round"
        className={!isActive ? "text-gray-400 dark:text-gray-500" : ""}
        style={isActive ? { color: "white" } : {}}
      >
        <path d="M2 20h20v2H2z"/>
        <path d="M7 3v5l5-3v5l5-3v12H7V7"/>
        <path d="M7 7H2v12h5"/>
      </svg>
    </div>
  );
};

const AppHeader: React.FC<AppHeaderProps> = ({
  selectedPT,
  onPTChange,
  currentActivity,
  onActivityChange,
  apiUrl = "http://43.157.205.158:4000/api/monthly-actual/by-site",
  year = 2026,
  activeTab = "Volume",
  onUnitActivityChange,
}) => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdownPT, setOpenDropdownPT] = useState<string | null>(null);
  const [allPTs, setAllPTs] = useState<string[]>([]);
  const [loadingPTs, setLoadingPTs] = useState(true);
  const [activitiesByPT, setActivitiesByPT] = useState<Record<string, string[]>>({});
  const [unitActivities, setUnitActivities] = useState<string[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const { isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar();

  const formatActivityName = (name: string) =>
    name
      .split("_")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoadingPTs(true);
        const response = await fetch(`${apiUrl}?year=${year}`);
        if (!response.ok) throw new Error();
        const result: ApiResponse = await response.json();
        if (result.success && result.data) {
          const pts = Object.keys(result.data);
          const map: Record<string, string[]> = {};
          pts.forEach((pt) => {
            map[pt] = Object.keys(result.data[pt]);
          });

          const JAKAMITRA = "Jakamitra";
          const allPtList = pts.includes(JAKAMITRA) ? pts : [...pts, JAKAMITRA];
          if (!map[JAKAMITRA]) {
            map[JAKAMITRA] = ["CUT & FILL", "stock"];
          }

          setAllPTs(allPtList);
          setActivitiesByPT(map);

          if (allPtList.length > 0 && !selectedPT) {
            onPTChange(allPtList[0]);
          }
        }
      } catch {
        setAllPTs([]);
      } finally {
        setLoadingPTs(false);
      }
    };
    fetchAll();
  }, [apiUrl, year]);

  useEffect(() => {
    const fetchUnit = async () => {
      try {
        const response = await fetch("http://43.157.205.158:4000/api/activities");
        if (!response.ok) throw new Error();
        const result = await response.json();
        if (result.success) {
          setUnitActivities(result.data);
          onUnitActivityChange?.(result.data[0]);
        }
      } catch {
        setUnitActivities([]);
      }
    };
    fetchUnit();
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdownPT(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleToggle = () => {
    if (window.innerWidth >= 1024) {
      toggleSidebar();
    } else {
      toggleMobileSidebar();
    }
  };

  const handlePTClick = (pt: string) => {
    onPTChange(pt);
    setOpenDropdownPT(openDropdownPT === pt ? null : pt);
  };

  const handleActivitySelect = (pt: string, activity: string) => {
    onPTChange(pt);
    if (activeTab === "Volume") {
      onActivityChange?.(activity);
    } else {
      onUnitActivityChange?.(activity);
    }
    setOpenDropdownPT(null);
  };

  const currentActivitiesForDropdown = (pt: string): string[] => {
    if (activeTab === "Volume") return activitiesByPT[pt] ?? [];
    return unitActivities;
  };

  return (
    <>
      <header
        className={`sticky top-0 z-[99999] w-full bg-white dark:bg-gray-900 transition-all duration-200 ${
          isScrolled
            ? "border-b border-gray-200 dark:border-gray-700"
            : "border-b border-transparent"
        }`}
      >
        <div className="grid grid-cols-[auto_1fr_auto] items-center h-[65px] px-6 gap-3">

          {/* Kiri: Hamburger */}
          <button
            className="flex items-center justify-center w-11 h-11 rounded-lg flex-shrink-0 transition-colors shadow-sm border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800"
            onClick={handleToggle}
            aria-label="Toggle Sidebar"
          >
            {isMobileOpen ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  fillRule="evenodd" clipRule="evenodd"
                  d="M6.21967 7.28131C5.92678 6.98841 5.92678 6.51354 6.21967 6.22065C6.51256 5.92775 6.98744 5.92775 7.28033 6.22065L11.999 10.9393L16.7176 6.22078C17.0105 5.92789 17.4854 5.92788 17.7782 6.22078C18.0711 6.51367 18.0711 6.98855 17.7782 7.28144L13.0597 12L17.7782 16.7186C18.0711 17.0115 18.0711 17.4863 17.7782 17.7792C17.4854 18.0721 17.0105 18.0721 16.7176 17.7792L11.999 13.0607L7.28033 17.7794C6.98744 18.0722 6.51256 18.0722 6.21967 17.7794C5.92678 17.4865 5.92678 17.0116 6.21967 16.7187L10.9384 12L6.21967 7.28131Z"
                  fill="#fd8f3f"
                />
              </svg>
            ) : (
              <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
                <path
                  fillRule="evenodd" clipRule="evenodd"
                  d="M0.583252 1C0.583252 0.585788 0.919038 0.25 1.33325 0.25H14.6666C15.0808 0.25 15.4166 0.585786 15.4166 1C15.4166 1.41421 15.0808 1.75 14.6666 1.75L1.33325 1.75C0.919038 1.75 0.583252 1.41422 0.583252 1ZM0.583252 11C0.583252 10.5858 0.919038 10.25 1.33325 10.25L14.6666 10.25C15.0808 10.25 15.4166 10.5858 15.4166 11C15.4166 11.4142 15.0808 11.75 14.6666 11.75L1.33325 11.75C0.919038 11.75 0.583252 11.4142 0.583252 11ZM1.33325 5.25C0.919038 5.25 0.583252 5.58579 0.583252 6C0.583252 6.41421 0.919038 6.75 1.33325 6.75L7.99992 6.75C8.41413 6.75 8.74992 6.41421 8.74992 6C8.74992 5.58579 8.41413 5.25 7.99992 5.25L1.33325 5.25Z"
                  fill="#fd8f3f"
                />
              </svg>
            )}
          </button>

          {/* Tengah: Nav PT (desktop) */}
          <nav className="hidden lg:flex items-center justify-center" ref={dropdownRef}>
            {loadingPTs ? (
              <span className="text-sm text-gray-400 animate-pulse">Memuat PT...</span>
            ) : (
              <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-xl p-1 gap-0.5">
                {allPTs.map((pt) => {
                  const isActive = selectedPT === pt;
                  const isOpen = openDropdownPT === pt;

                  return (
                    <div key={pt} className="relative">
                      <button
                        onClick={() => handlePTClick(pt)}
                        className={`
                          flex items-center gap-1.5 px-5 py-2 rounded-lg text-sm transition-all duration-200
                          ${isActive
                            ? "bg-white dark:bg-gray-700 shadow-sm font-semibold"
                            : "font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                          }
                        `}
                        style={isActive ? { color: "#fd8f3f" } : {}}
                      >
                        <span>{pt}</span>
                        <svg
                          width="10" height="10" viewBox="0 0 16 16" fill="none"
                          className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                        >
                          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>

                      {isOpen && (
                        <div
                          className="absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl shadow-black/10 dark:shadow-black/40 min-w-[220px] py-2 z-[99999]"
                          style={{ animation: "dropdownSlide 0.15s ease-out" }}
                        >
                          <div className="px-4 py-1.5 mb-1">
                            <span className="text-[10px] font-bold tracking-widest text-gray-400 dark:text-gray-500 uppercase">
                              Aktivitas — {pt}
                            </span>
                          </div>
                          {currentActivitiesForDropdown(pt).length === 0 ? (
                            <div className="px-4 py-2 text-sm text-gray-400">Tidak ada aktivitas</div>
                          ) : (
                            currentActivitiesForDropdown(pt).map((act) => {
                              const isCurrentAct = currentActivity === act;
                              return (
                                <button
                                  key={act}
                                  onClick={() => handleActivitySelect(pt, act)}
                                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${isCurrentAct ? "" : "hover:bg-gray-50 dark:hover:bg-gray-800"}`}
                                  style={isCurrentAct ? { backgroundColor: "rgba(117, 176, 249, 0.1)" } : {}}
                                >
                                  <ActivityIcon activity={act} isActive={isCurrentAct} />
                                  <p
                                    className={`text-sm leading-tight ${!isCurrentAct ? "text-gray-600 dark:text-gray-300 font-medium" : "font-semibold"}`}
                                    style={isCurrentAct ? { color: "#fd8f3f" } : {}}
                                  >
                                    {formatActivityName(act)}
                                  </p>
                                  {isCurrentAct && (
                                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="ml-auto flex-shrink-0" style={{ color: "#fd8f3f" }}>
                                      <path d="M3 8l4 4 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                  )}
                                </button>
                              );
                            })
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </nav>

          {/* Kanan: ThemeToggle + 3-dots mobile */}
          <div className="flex items-center gap-2 justify-end">
            <ThemeToggleButton />
            <button
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden flex items-center justify-center w-11 h-11 rounded-2xl text-gray-600 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 transition-colors shadow-sm border border-gray-100 dark:border-gray-700"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  fillRule="evenodd" clipRule="evenodd"
                  d="M5.99902 10.4951C6.82745 10.4951 7.49902 11.1667 7.49902 11.9951V12.0051C7.49902 12.8335 6.82745 13.5051 5.99902 13.5051C5.1706 13.5051 4.49902 12.8335 4.49902 12.0051V11.9951C4.49902 11.1667 5.1706 10.4951 5.99902 10.4951ZM17.999 10.4951C18.8275 10.4951 19.499 11.1667 19.499 11.9951V12.0051C19.499 12.8335 18.8275 13.5051 17.999 13.5051C17.1706 13.5051 16.499 12.8335 16.499 12.0051V11.9951C16.499 11.1667 17.1706 10.4951 17.999 10.4951ZM13.499 11.9951C13.499 11.1667 12.8275 10.4951 11.999 10.4951C11.1706 10.4951 10.499 11.1667 10.499 11.9951V12.0051C10.499 12.8335 11.1706 13.5051 11.999 13.5051C12.8275 13.5051 13.499 12.8335 13.499 12.0051V11.9951Z"
                  fill="#fd8f3f"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Dropdown */}
      {isMobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-[99997] bg-black/20 backdrop-blur-[2px] lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div
            className="fixed top-[65px] left-0 right-0 z-[99998] lg:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-xl overflow-y-auto max-h-[80vh]"
            style={{ animation: "mobileMenuSlideDown 0.18s ease-out" }}
          >
            <div className="px-3 pt-2 pb-3 space-y-1">

              {/* Theme Row */}
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-2xl bg-gray-50 dark:bg-gray-800">
                <div className="w-9 h-9 rounded-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 flex items-center justify-center flex-shrink-0">
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="dark:hidden">
                    <path d="M17.4547 11.97L18.1799 12.1611C18.265 11.8383 18.1265 11.4982 17.8401 11.3266C17.5538 11.1551 17.1885 11.1934 16.944 11.4207L17.4547 11.97ZM8.0306 2.5459L8.57989 3.05657C8.80718 2.81209 8.84554 2.44682 8.67398 2.16046C8.50243 1.8741 8.16227 1.73559 7.83948 1.82066L8.0306 2.5459ZM12.9154 13.0035C9.64678 13.0035 6.99707 10.3538 6.99707 7.08524H5.49707C5.49707 11.1823 8.81835 14.5035 12.9154 14.5035V13.0035ZM16.944 11.4207C15.8869 12.4035 14.4721 13.0035 12.9154 13.0035V14.5035C14.8657 14.5035 16.6418 13.7499 17.9654 12.5193L16.944 11.4207ZM16.7295 11.7789C15.9437 14.7607 13.2277 16.9586 10.0003 16.9586V18.4586C13.9257 18.4586 17.2249 15.7853 18.1799 12.1611L16.7295 11.7789ZM10.0003 16.9586C6.15734 16.9586 3.04199 13.8433 3.04199 10.0003H1.54199C1.54199 14.6717 5.32892 18.4586 10.0003 18.4586V16.9586ZM3.04199 10.0003C3.04199 6.77289 5.23988 4.05695 8.22173 3.27114L7.83948 1.82066C4.21532 2.77574 1.54199 6.07486 1.54199 10.0003H3.04199ZM6.99707 7.08524C6.99707 5.52854 7.5971 4.11366 8.57989 3.05657L7.48132 2.03522C6.25073 3.35885 5.49707 5.13487 5.49707 7.08524H6.99707Z" fill="#fd8f3f"/>
                  </svg>
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="hidden dark:block">
                    <path fillRule="evenodd" clipRule="evenodd" d="M9.99998 1.5415C10.4142 1.5415 10.75 1.87729 10.75 2.2915V3.5415C10.75 3.95572 10.4142 4.2915 9.99998 4.2915C9.58577 4.2915 9.24998 3.95572 9.24998 3.5415V2.2915C9.24998 1.87729 9.58577 1.5415 9.99998 1.5415ZM10.0009 6.79327C8.22978 6.79327 6.79402 8.22904 6.79402 10.0001C6.79402 11.7712 8.22978 13.207 10.0009 13.207C11.772 13.207 13.2078 11.7712 13.2078 10.0001C13.2078 8.22904 11.772 6.79327 10.0009 6.79327ZM5.29402 10.0001C5.29402 7.40061 7.40135 5.29327 10.0009 5.29327C12.6004 5.29327 14.7078 7.40061 14.7078 10.0001C14.7078 12.5997 12.6004 14.707 10.0009 14.707C7.40135 14.707 5.29402 12.5997 5.29402 10.0001ZM15.9813 5.08035C16.2742 4.78746 16.2742 4.31258 15.9813 4.01969C15.6884 3.7268 15.2135 3.7268 14.9207 4.01969L14.0368 4.90357C13.7439 5.19647 13.7439 5.67134 14.0368 5.96423C14.3297 6.25713 14.8045 6.25713 15.0974 5.96423L15.9813 5.08035ZM18.4577 10.0001C18.4577 10.4143 18.1219 10.7501 17.7077 10.7501H16.4577C16.0435 10.7501 15.7077 10.4143 15.7077 10.0001C15.7077 9.58592 16.0435 9.25013 16.4577 9.25013H17.7077C18.1219 9.25013 18.4577 9.58592 18.4577 10.0001ZM14.9207 15.9806C15.2135 16.2735 15.6884 16.2735 15.9813 15.9806C16.2742 15.6877 16.2742 15.2128 15.9813 14.9199L15.0974 14.036C14.8045 13.7431 14.3297 13.7431 14.0368 14.036C13.7439 14.3289 13.7439 14.8038 14.0368 15.0967L14.9207 15.9806ZM9.99998 15.7088C10.4142 15.7088 10.75 16.0445 10.75 16.4588V17.7088C10.75 18.123 10.4142 18.4588 9.99998 18.4588C9.58577 18.4588 9.24998 18.123 9.24998 17.7088V16.4588C9.24998 16.0445 9.58577 15.7088 9.99998 15.7088ZM5.96356 15.0972C6.25646 14.8043 6.25646 14.3295 5.96356 14.0366C5.67067 13.7437 5.1958 13.7437 4.9029 14.0366L4.01902 14.9204C3.72613 15.2133 3.72613 15.6882 4.01902 15.9811C4.31191 16.274 4.78679 16.274 5.07968 15.9811L5.96356 15.0972ZM4.29224 10.0001C4.29224 10.4143 3.95645 10.7501 3.54224 10.7501H2.29224C1.87802 10.7501 1.54224 10.4143 1.54224 10.0001C1.54224 9.58592 1.87802 9.25013 2.29224 9.25013H3.54224C3.95645 9.25013 4.29224 9.58592 4.29224 10.0001ZM4.9029 5.9637C5.1958 6.25659 5.67067 6.25659 5.96356 5.9637C6.25646 5.6708 6.25646 5.19593 5.96356 4.90303L5.07968 4.01915C4.78679 3.72626 4.31191 3.72626 4.01902 4.01915C3.72613 4.31204 3.72613 4.78692 4.01902 5.07981L4.9029 5.9637Z" fill="#fd8f3f"/>
                  </svg>
                </div>
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 flex-1">Mode Gelap</p>
                <ThemeToggleButton />
              </div>

              {/* Section label */}
              <div className="px-3 pt-2 pb-1">
                <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Pilih PT & Aktivitas</span>
              </div>

              {/* PT list */}
              {loadingPTs ? (
                <div className="px-3 py-3 text-sm text-gray-400 animate-pulse">Memuat...</div>
              ) : (
                allPTs.map((pt) => {
                  const isActive = selectedPT === pt;
                  const ptActivities = currentActivitiesForDropdown(pt);
                  const isOpen = openDropdownPT === pt;

                  return (
                    <div key={pt}>
                      <button
                        onClick={() => {
                          onPTChange(pt);
                          setOpenDropdownPT(isOpen ? null : pt);
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-colors ${
                          isActive
                            ? "text-white"
                            : "bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                        style={isActive ? { backgroundColor: "#fd8f3f" } : {}}
                      >
                        <p className={`text-sm font-semibold flex-1 text-left ${isActive ? "text-white" : "text-gray-800 dark:text-gray-100"}`}>
                          {pt}
                        </p>
                        <svg
                          width="14" height="14" viewBox="0 0 16 16" fill="none"
                          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
                          style={isActive ? { color: "white" } : { color: "#9ca3af" }}
                        >
                          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>

                      {isOpen && (
                        <div
                          className="ml-4 mt-1 space-y-0.5 pl-3"
                          style={{ borderLeft: "2px solid rgba(117, 176, 249, 0.4)" }}
                        >
                          {ptActivities.map((act) => {
                            const isCur = currentActivity === act;
                            return (
                              <button
                                key={act}
                                onClick={() => {
                                  handleActivitySelect(pt, act);
                                  setMobileMenuOpen(false);
                                }}
                                className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left transition-colors ${
                                  isCur
                                    ? "text-white"
                                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                                }`}
                                style={isCur ? { backgroundColor: "#fd8f3f" } : {}}
                              >
                                {/* Icon mobile */}
                                {(() => {
                                  const iconUrl = getActivityIcon(act);
                                  return iconUrl ? (
                                    <img
                                      src={iconUrl}
                                      alt={act}
                                      width={14}
                                      height={14}
                                      className="flex-shrink-0"
                                      style={isCur ? { filter: "brightness(0) invert(1)" } : { filter: "brightness(0) invert(0.5)" }}
                                    />
                                  ) : isCur ? (
                                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="flex-shrink-0">
                                      <path d="M3 8l4 4 6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                  ) : null;
                                })()}
                                <span className="text-sm font-medium">{formatActivityName(act)}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </>
      )}

      <style>{`
        @keyframes dropdownSlide {
          from { opacity: 0; transform: translateX(-50%) translateY(-6px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        @keyframes mobileMenuSlideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
};

export default AppHeader;