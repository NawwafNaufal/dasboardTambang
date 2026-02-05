import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import { Outlet } from "react-router";
<<<<<<< HEAD
import { useState } from "react";
=======
>>>>>>> f734bc196743bbce448ea7b7d360b032d26ce8a9
import AppHeader from "./AppHeader";
import Backdrop from "./Backdrop";
import AppSidebar from "./AppSidebar";

const LayoutContent: React.FC = () => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
<<<<<<< HEAD
  const [selectedPT, setSelectedPT] = useState("PT Semen Tonasa"); 
  const [currentActivity, setCurrentActivity] = useState<string>(""); // ✅ Tambahkan state untuk aktivitas
=======
>>>>>>> f734bc196743bbce448ea7b7d360b032d26ce8a9

  return (
    <div className="min-h-screen xl:flex">
      <div>
        <AppSidebar />
        <Backdrop />
      </div>
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${
          isExpanded || isHovered ? "lg:ml-[290px]" : "lg:ml-[90px]"
        } ${isMobileOpen ? "ml-0" : ""}`}
      >
<<<<<<< HEAD
        <AppHeader 
          selectedPT={selectedPT}
          onPTChange={setSelectedPT}
          currentActivity={currentActivity} // ✅ Pass currentActivity ke header
          onActivityChange={setCurrentActivity} // ✅ Pass callback untuk update aktivitas
        />
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
          <Outlet context={{ selectedPT, currentActivity }} /> {/* ✅ Pass currentActivity ke child routes */}
=======
        <AppHeader />
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
          <Outlet />
>>>>>>> f734bc196743bbce448ea7b7d360b032d26ce8a9
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

<<<<<<< HEAD
export default AppLayout;
=======
export default AppLayout;
>>>>>>> f734bc196743bbce448ea7b7d360b032d26ce8a9
