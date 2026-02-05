import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { useSidebar } from "../context/SidebarContext";
import { ThemeToggleButton } from "../components/common/ThemeToggleButton";
import NotificationDropdown from "../components/header/NotificationDropdown";
import UserDropdown from "../components/header/UserDropdown";

interface AppHeaderProps {
  selectedPT: string;
  onPTChange: (pt: string) => void;
  currentActivity?: string;
  onActivityChange?: (activity: string) => void;
  apiUrl?: string;
  year?: number;
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

const AppHeader: React.FC<AppHeaderProps> = ({ 
  selectedPT, 
  onPTChange,
  currentActivity,
  onActivityChange,
  apiUrl = "http://localhost:4000/api/monthly-actual/by-site",
  year = 2025
}) => {
  const [isApplicationMenuOpen, setApplicationMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [activities, setActivities] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const { isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar();

  // ✅ Fungsi untuk format nama aktivitas (snake_case → Title Case)
  const formatActivityName = (name: string) => {
    return name
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Fetch activities from API based on selected PT
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        console.log('🔍 [AppHeader] Fetching activities for PT:', selectedPT, 'Year:', year);
        
        const response = await fetch(`${apiUrl}?year=${year}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result: ApiResponse = await response.json();
        console.log('📊 [AppHeader] Monthly Actual API Response:', result);
        
        if (result.success && result.data[selectedPT]) {
          // Extract activity names (product names) from the data
          const activityNames = Object.keys(result.data[selectedPT]);
          setActivities(activityNames);
          
          console.log('📋 [AppHeader] Raw activities:', activityNames);
          
          // ✅ Set aktivitas pertama sebagai default dengan format Title Case
          if (activityNames.length > 0 && onActivityChange && !currentActivity) {
            const formattedActivity = formatActivityName(activityNames[0]);
            onActivityChange(formattedActivity);
            console.log('🎯 [AppHeader] Initial activity set to:', formattedActivity);
          }
        } else {
          console.warn(`⚠️ [AppHeader] No activities found for ${selectedPT}`);
          setActivities([]);
        }
      } catch (err) {
        console.error("❌ [AppHeader] Error fetching activities:", err);
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [selectedPT, apiUrl, year]);

  const handleToggle = () => {
    if (window.innerWidth >= 1024) {
      toggleSidebar();
    } else {
      toggleMobileSidebar();
    }
  };

  const toggleApplicationMenu = () => {
    setApplicationMenuOpen(!isApplicationMenuOpen);
  };

  const goToNext = () => {
    const nextIndex = selectedCategory < activities.length - 1 ? selectedCategory + 1 : 0;
    setSelectedCategory(nextIndex);
    
    // ✅ Panggil callback dengan format Title Case
    if (onActivityChange && activities[nextIndex]) {
      const formattedActivity = formatActivityName(activities[nextIndex]);
      onActivityChange(formattedActivity);
      console.log('🎯 [AppHeader] Activity changed to:', formattedActivity);
    }
  };

  useEffect(() => {
    // Reset selected category when PT changes or year changes
    setSelectedCategory(0);
  }, [selectedPT, year]);

  // ✅ Format nama aktivitas untuk ditampilkan
  const currentActivityDisplay = activities[selectedCategory] 
    ? formatActivityName(activities[selectedCategory])
    : "Loading...";

  return (
    <header className="sticky top-0 flex w-full bg-white border-gray-200 z-99999 dark:border-gray-800 dark:bg-gray-900 lg:border-b">
      <div className="flex flex-col items-center justify-between grow lg:flex-row lg:px-6">
        <div className="flex items-center justify-between w-full gap-2 px-3 py-3 border-b border-gray-200 dark:border-gray-800 sm:gap-4 lg:justify-normal lg:border-b-0 lg:px-0 lg:py-4">
          <button
            className="items-center justify-center w-10 h-10 text-gray-500 border-gray-200 rounded-lg z-99999 dark:border-gray-800 lg:flex dark:text-gray-400 lg:h-11 lg:w-11 lg:border"
            onClick={handleToggle}
            aria-label="Toggle Sidebar"
          >
            {isMobileOpen ? (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M6.21967 7.28131C5.92678 6.98841 5.92678 6.51354 6.21967 6.22065C6.51256 5.92775 6.98744 5.92775 7.28033 6.22065L11.999 10.9393L16.7176 6.22078C17.0105 5.92789 17.4854 5.92788 17.7782 6.22078C18.0711 6.51367 18.0711 6.98855 17.7782 7.28144L13.0597 12L17.7782 16.7186C18.0711 17.0115 18.0711 17.4863 17.7782 17.7792C17.4854 18.0721 17.0105 18.0721 16.7176 17.7792L11.999 13.0607L7.28033 17.7794C6.98744 18.0722 6.51256 18.0722 6.21967 17.7794C5.92678 17.4865 5.92678 17.0116 6.21967 16.7187L10.9384 12L6.21967 7.28131Z"
                  fill="currentColor"
                />
              </svg>
            ) : (
              <svg
                width="16"
                height="12"
                viewBox="0 0 16 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M0.583252 1C0.583252 0.585788 0.919038 0.25 1.33325 0.25H14.6666C15.0808 0.25 15.4166 0.585786 15.4166 1C15.4166 1.41421 15.0808 1.75 14.6666 1.75L1.33325 1.75C0.919038 1.75 0.583252 1.41422 0.583252 1ZM0.583252 11C0.583252 10.5858 0.919038 10.25 1.33325 10.25L14.6666 10.25C15.0808 10.25 15.4166 10.5858 15.4166 11C15.4166 11.4142 15.0808 11.75 14.6666 11.75L1.33325 11.75C0.919038 11.75 0.583252 11.4142 0.583252 11ZM1.33325 5.25C0.919038 5.25 0.583252 5.58579 0.583252 6C0.583252 6.41421 0.919038 6.75 1.33325 6.75L7.99992 6.75C8.41413 6.75 8.74992 6.41421 8.74992 6C8.74992 5.58579 8.41413 5.25 7.99992 5.25L1.33325 5.25Z"
                  fill="currentColor"
                />
              </svg>
            )}
          </button>

          <Link to="/" className="lg:hidden">
            <img
              className="dark:hidden"
              src="./images/logo/logo.svg"
              alt="Logo"
            />
            <img
              className="hidden dark:block"
              src="./images/logo/logo-dark.svg"
              alt="Logo"
            />
          </Link>

          <button
            onClick={toggleApplicationMenu}
            className="flex items-center justify-center w-10 h-10 text-gray-700 rounded-lg z-99999 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 lg:hidden"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5.99902 10.4951C6.82745 10.4951 7.49902 11.1667 7.49902 11.9951V12.0051C7.49902 12.8335 6.82745 13.5051 5.99902 13.5051C5.1706 13.5051 4.49902 12.8335 4.49902 12.0051V11.9951C4.49902 11.1667 5.1706 10.4951 5.99902 10.4951ZM17.999 10.4951C18.8275 10.4951 19.499 11.1667 19.499 11.9951V12.0051C19.499 12.8335 18.8275 13.5051 17.999 13.5051C17.1706 13.5051 16.499 12.8335 16.499 12.0051V11.9951C16.499 11.1667 17.1706 10.4951 17.999 10.4951ZM13.499 11.9951C13.499 11.1667 12.8275 10.4951 11.999 10.4951C11.1706 10.4951 10.499 11.1667 10.499 11.9951V12.0051C10.499 12.8335 11.1706 13.5051 11.999 13.5051C12.8275 13.5051 13.499 12.8335 13.499 12.0051V11.9951Z"
                fill="currentColor"
              />
            </svg>
          </button>

          {/* Category Selector - Hidden on mobile, visible on desktop */}
          <div className="hidden lg:block">
            <div className="relative flex items-center gap-2">
              {/* Category display (activity name from API) */}
              <div className="flex items-center justify-center gap-2.5 px-4 py-2.5 text-sm text-black bg-white border border-gray-200 rounded-lg w-64">
                {/* Factory Icon */}
                <svg 
                  className="w-5 h-5 flex-shrink-0" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2"
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M2 20h20v2H2z"/>
                  <path d="M7 3v5l5-3v5l5-3v12H7V7"/>
                  <path d="M7 7H2v12h5"/>
                </svg>
                
                <span className="tracking-wide truncate">
                  {loading ? "Loading..." : activities.length > 0 ? currentActivityDisplay : "No activities"}
                </span>
              </div>

              {/* Right arrow button */}
              {!loading && activities.length > 0 && (
                <button
                  onClick={goToNext}
                  className="flex items-center justify-center flex-shrink-0 w-11 h-11 bg-transparent border-2 border-gray-200 rounded-lg text-black transition-all hover:bg-gray-100"
                  aria-label="Next activity"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6 12L10 8L6 4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
        <div
          className={`${
            isApplicationMenuOpen ? "flex" : "hidden"
          } items-center justify-between w-full gap-4 px-5 py-4 lg:flex shadow-theme-md lg:justify-end lg:px-0 lg:shadow-none`}
        >
          <div className="flex items-center gap-2 2xsm:gap-3">
            <ThemeToggleButton />
            <NotificationDropdown />
          </div>
          <UserDropdown 
            selectedPT={selectedPT}
            onPTChange={onPTChange}
          />
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
