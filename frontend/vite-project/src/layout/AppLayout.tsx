import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import { Outlet } from "react-router";
import { useState } from "react";
import AppHeader from "./AppHeader";
import Backdrop from "./Backdrop";
import AppSidebar from "./AppSidebar";

const LayoutContent: React.FC = () => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const [selectedPT, setSelectedPT] = useState("PT Semen Tonasa");
  const [currentActivity, setCurrentActivity] = useState<string>("");
  const [activeTab, setActiveTab] = useState("Volume");
  const [currentUnitActivity, setCurrentUnitActivity] = useState<string>("");

  const sidebarOpen = isExpanded || isHovered || isMobileOpen;

  return (
    <div className="min-h-screen xl:flex">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <AppSidebar />
      </div>

      {/* Backdrop */}
      {sidebarOpen && <Backdrop />}

      {/* Main content */}
      <div
        className={`flex-1 min-w-0 w-full transition-all duration-300 ease-in-out
          ${isExpanded || isHovered ? "lg:ml-[240px]" : isMobileOpen ? "ml-0" : "lg:ml-0"}
        `}
      >
        <AppHeader
          selectedPT={selectedPT}
          onPTChange={setSelectedPT}
          currentActivity={currentActivity}
          onActivityChange={setCurrentActivity}
          activeTab={activeTab}
          onUnitActivityChange={setCurrentUnitActivity}
        />
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
          <Outlet
            context={{
              selectedPT,
              currentActivity,
              activeTab,
              setActiveTab,
              currentUnitActivity,
            }}
          />
        </div>
      </div>
    </div>
  );
};

const AppLayout: React.FC = () => {
  return (
    <SidebarProvider>
      <LayoutContent />
    </SidebarProvider>
  );
};

export default AppLayout;