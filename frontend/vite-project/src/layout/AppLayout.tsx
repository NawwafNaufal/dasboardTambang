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

  return (
    <div className="min-h-screen xl:flex">
      <div>
        <AppSidebar />
        <Backdrop />
      </div>
      <div
        className={`flex-1 transition-all duration-300 ease-in-out min-w-0 overflow-hidden ${
          isExpanded || isHovered ? "lg:ml-[290px]" : "lg:ml-[90px]"
        } ${isMobileOpen ? "ml-0" : ""}`}
      >
        <AppHeader
          selectedPT={selectedPT}
          onPTChange={setSelectedPT}
          currentActivity={currentActivity}
          onActivityChange={setCurrentActivity}
        />
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6 overflow-hidden">
          <Outlet context={{ selectedPT, currentActivity }} />
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