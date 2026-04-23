import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
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
  "loading hauling": "https://img.icons8.com/ios/50/dump-truck.png",
  "loading_hauling": "https://img.icons8.com/ios/50/dump-truck.png",
  "loading": "https://img.icons8.com/ios/50/dump-truck.png",
  "hauling": "https://img.icons8.com/ios/50/mine-cart.png",
  "drilling": "https://img.icons8.com/material/24/drilled-well.png",
  "perintisan used": "https://img.icons8.com/ios/50/flag--v1.png",
  "perintisan_used": "https://img.icons8.com/ios/50/flag--v1.png",
  "perintisan new": "https://img.icons8.com/ios/50/map-marker--v1.png",
  "perintisan_new": "https://img.icons8.com/ios/50/map-marker--v1.png",
  "breaker": "https://img.icons8.com/ios/50/lime-stone.png",
  "buldozzer new": "https://img.icons8.com/ios/50/bulldozer.png",
  "buldozzer_new": "https://img.icons8.com/ios/50/bulldozer.png",
  "bulldozer new": "https://img.icons8.com/ios/50/bulldozer.png",
  "bulldozer_new": "https://img.icons8.com/ios/50/bulldozer.png",
  "buldozzer used": "https://img.icons8.com/ios-filled/50/bulldozer.png",
  "buldozzer_used": "https://img.icons8.com/ios-filled/50/bulldozer.png",
  "bulldozer used": "https://img.icons8.com/ios-filled/50/bulldozer.png",
  "bulldozer_used": "https://img.icons8.com/ios-filled/50/bulldozer.png",
  "ob rehandle": "https://img.icons8.com/ios/50/portraits.png",
  "ob_rehandle": "https://img.icons8.com/ios/50/portraits.png",
  "ob institiu": "https://img.icons8.com/ios/50/chevron-right.png",
  "ob_institiu": "https://img.icons8.com/ios/50/chevron-right.png",
  "ob insitu": "https://img.icons8.com/ios/50/chevron-right.png",
  "ob_insitu": "https://img.icons8.com/ios/50/chevron-right.png",
  "er": "https://img.icons8.com/ios/50/harvester.png",
  "ppo direct": "https://img.icons8.com/ios/50/gears--v1.png",
  "ppo_direct": "https://img.icons8.com/ios/50/gears--v1.png",
  "cut & fill": "https://img.icons8.com/ios/50/golden-fever.png",
  "cut_&_fill": "https://img.icons8.com/ios/50/golden-fever.png",
  "cut and fill": "https://img.icons8.com/ios/50/golden-fever.png",
  "cut_and_fill": "https://img.icons8.com/ios/50/golden-fever.png",
  "cut & fills": "https://img.icons8.com/ios/50/golden-fever.png",
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
        <path d="M2 20h20v2H2z" />
        <path d="M7 3v5l5-3v5l5-3v12H7V7" />
        <path d="M7 7H2v12h5" />
      </svg>
    </div>
  );
};

// ─── Per-tab Dropdown ────────────────────────────────────────────────────────
interface PTDropdownProps {
  pt: string;
  ptIndex: number;
  isOpen: boolean;
  prevOpenIndex: number | null;
  activities: string[];
  currentActivity?: string;
  onSelect: (pt: string, act: string) => void;
}

const PTDropdown: React.FC<PTDropdownProps> = ({
  pt,
  ptIndex,
  isOpen,
  prevOpenIndex,
  activities,
  currentActivity,
  onSelect,
}) => {
  const formatActivityName = (name: string) =>
    name.split("_").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

  const slideX =
    prevOpenIndex === null ? 0 : prevOpenIndex > ptIndex ? 100 : -100;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="absolute left-1/2 -translate-x-1/2 top-full h-[28px] w-[240px]" />
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute top-[calc(100%+24px)] left-1/2 -translate-x-1/2 w-[240px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl shadow-black/10 dark:shadow-black/40 py-2 z-[99999]"
          >
            <span
              className="absolute left-1/2 top-0 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-tl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
              style={{ clipPath: "polygon(0 0, 100% 0, 50% 50%, 0% 100%)" }}
            />
            <div className="overflow-hidden">
              <motion.div
                key={pt}
                initial={{ opacity: 0, x: slideX }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
              >
                <div className="px-4 py-1.5 mb-1">
                  <span className="text-[10px] font-bold tracking-widest text-gray-400 dark:text-gray-500 uppercase">
                    Aktivitas — {pt}
                  </span>
                </div>
                {activities.length === 0 ? (
                  <div className="px-4 py-2 text-sm text-gray-400">Tidak ada aktivitas</div>
                ) : (
                  activities.map((act) => {
                    const isCurrentAct = currentActivity === act;
                    return (
                      <button
                        key={act}
                        onClick={() => onSelect(pt, act)}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                          isCurrentAct ? "" : "hover:bg-gray-50 dark:hover:bg-gray-800"
                        }`}
                        style={isCurrentAct ? { backgroundColor: "rgba(253, 143, 63, 0.1)" } : {}}
                      >
                        <ActivityIcon activity={act} isActive={isCurrentAct} />
                        <p
                          className={`text-sm leading-tight ${
                            !isCurrentAct ? "text-gray-600 dark:text-gray-300 font-medium" : "font-semibold"
                          }`}
                          style={isCurrentAct ? { color: "#fd8f3f" } : {}}
                        >
                          {formatActivityName(act)}
                        </p>
                        {isCurrentAct && (
                          <svg
                            width="14" height="14" viewBox="0 0 16 16" fill="none"
                            className="ml-auto flex-shrink-0"
                            style={{ color: "#fd8f3f" }}
                          >
                            <path d="M3 8l4 4 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </button>
                    );
                  })
                )}
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// ─── Main AppHeader ──────────────────────────────────────────────────────────
const AppHeader: React.FC<AppHeaderProps> = ({
  selectedPT,
  onPTChange,
  currentActivity,
  onActivityChange,
  apiUrl = "http://moa2.site/api/api/monthly-actual/by-site",
  year = 2026,
  activeTab = "Volume",
  onUnitActivityChange,
}) => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdownPT, setOpenDropdownPT] = useState<string | null>(null);
  const [prevOpenIndex, setPrevOpenIndex] = useState<number | null>(null);
  const [allPTs, setAllPTs] = useState<string[]>([]);
  const [loadingPTs, setLoadingPTs] = useState(true);
  const [activitiesByPT, setActivitiesByPT] = useState<Record<string, string[]>>({});
  const [unitActivities, setUnitActivities] = useState<string[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const { isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar();

  const formatActivityName = (name: string) =>
    name.split("_").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

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
          pts.forEach((pt) => { map[pt] = Object.keys(result.data[pt]); });

          const JAKAMITRA = "Jakamitra";
          const allPtList = pts.includes(JAKAMITRA) ? pts : [...pts, JAKAMITRA];
          if (!map[JAKAMITRA]) map[JAKAMITRA] = ["CUT & FILL", "stock"];

          setAllPTs(allPtList);
          setActivitiesByPT(map);
          if (allPtList.length > 0 && !selectedPT) onPTChange(allPtList[0]);
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
        setPrevOpenIndex(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleToggle = () => {
    if (window.innerWidth >= 1024) toggleSidebar();
    else toggleMobileSidebar();
  };

  const handlePTHover = (pt: string) => {
    if (openDropdownPT && openDropdownPT !== pt) {
      setPrevOpenIndex(allPTs.indexOf(openDropdownPT));
    }
    setOpenDropdownPT(pt);
    onPTChange(pt);
  };

  const handleNavLeave = () => {
    setOpenDropdownPT(null);
    setPrevOpenIndex(null);
  };

  const handleActivitySelect = (pt: string, activity: string) => {
    onPTChange(pt);
    if (activeTab === "Volume") onActivityChange?.(activity);
    else onUnitActivityChange?.(activity);
    setOpenDropdownPT(null);
    setPrevOpenIndex(null);
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
        <div className="flex items-center justify-between h-[65px] px-4 lg:px-6 gap-3">

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

          {/* Tengah: Nav PT — hanya tampil di desktop */}
          <nav
            className="hidden lg:flex flex-1 items-center justify-center"
            ref={dropdownRef}
            onMouseLeave={handleNavLeave}
          >
            {loadingPTs ? (
              <span className="text-sm text-gray-400 animate-pulse">Memuat PT...</span>
            ) : (
              <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-xl p-1 gap-0.5">
                {allPTs.map((pt, idx) => {
                  const isActive = selectedPT === pt;
                  const isOpen = openDropdownPT === pt;

                  return (
                    <div key={pt} className="relative">
                      <button
                        onMouseEnter={() => handlePTHover(pt)}
                        onClick={() => handlePTHover(pt)}
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
                        <motion.svg
                          width="10" height="10" viewBox="0 0 16 16" fill="none"
                          animate={{ rotate: isOpen ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </motion.svg>
                      </button>

                      <PTDropdown
                        pt={pt}
                        ptIndex={idx}
                        isOpen={isOpen}
                        prevOpenIndex={prevOpenIndex}
                        activities={currentActivitiesForDropdown(pt)}
                        currentActivity={currentActivity}
                        onSelect={handleActivitySelect}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </nav>

          {/* Kanan: ThemeToggle + 3-dots mobile */}
          <div className="flex items-center gap-2 flex-shrink-0">
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

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <div
              className="fixed inset-0 z-[99997] bg-black/20 backdrop-blur-[2px] lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="fixed top-[65px] left-0 right-0 z-[99998] lg:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-xl overflow-y-auto max-h-[80vh]"
            >
              <div className="px-3 pt-2 pb-3 space-y-1">

                {/* ✅ Theme Row dihapus — sudah ada di navbar */}

                <div className="px-3 pt-2 pb-1">
                  <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                    Pilih PT & Aktivitas
                  </span>
                </div>

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
                            isActive ? "text-white" : "bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
                          }`}
                          style={isActive ? { backgroundColor: "#fd8f3f" } : {}}
                        >
                          <p className={`text-sm font-semibold flex-1 text-left ${isActive ? "text-white" : "text-gray-800 dark:text-gray-100"}`}>
                            {pt}
                          </p>
                          <motion.svg
                            width="14" height="14" viewBox="0 0 16 16" fill="none"
                            animate={{ rotate: isOpen ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                            style={isActive ? { color: "white" } : { color: "#9ca3af" }}
                          >
                            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </motion.svg>
                        </button>

                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              key={pt + "-mob"}
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2, ease: "easeInOut" }}
                              className="overflow-hidden ml-4 mt-1 pl-3"
                              style={{ borderLeft: "2px solid rgba(117, 176, 249, 0.4)" }}
                            >
                              <div className="space-y-0.5 py-1">
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
                                        isCur ? "text-white" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                                      }`}
                                      style={isCur ? { backgroundColor: "#fd8f3f" } : {}}
                                    >
                                      {(() => {
                                        const iconUrl = getActivityIcon(act);
                                        return iconUrl ? (
                                          <img
                                            src={iconUrl} alt={act} width={14} height={14}
                                            className="flex-shrink-0"
                                            style={isCur ? { filter: "brightness(0) invert(1)" } : { filter: "brightness(0) invert(0.5)" }}
                                          />
                                        ) : isCur ? (
                                          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="flex-shrink-0">
                                            <path d="M3 8l4 4 6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                          </svg>
                                        ) : null;
                                      })()}
                                      <span className="text-sm font-medium">{formatActivityName(act)}</span>
                                    </button>
                                  );
                                })}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default AppHeader;