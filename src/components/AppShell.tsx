import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Capacitor } from "@capacitor/core";
import { StatusBar, Style } from "@capacitor/status-bar";
import TopBar from "./TopBar";
import BottomNav from "./BottomNav";
import InstallPrompt from "./InstallPrompt";
import { useAdMob } from "@/hooks/useAdMob";
import { ScrollProvider, useScrollContainer } from "@/contexts/ScrollContext";

const AppShellInner = () => {
  useAdMob();
  const scrollContainerRef = useScrollContainer();

  useEffect(() => {
    if (Capacitor.getPlatform() === "android") {
      try {
        StatusBar.setBackgroundColor({ color: "#0D0D0D" });
        StatusBar.setStyle({ style: Style.Dark });
      } catch (_) {
        // ignore – status bar plugin may not be available
      }
    }
  }, []);
  return (
    <div className="flex flex-col h-dvh overflow-hidden bg-background">
      <InstallPrompt />
      <div className="flex-shrink-0">
        <TopBar />
      </div>
      <main ref={scrollContainerRef} className="flex-1 min-h-0 overflow-y-auto">
        <div className="max-w-[480px] mx-auto px-4 py-4">
          <Outlet />
        </div>
      </main>
      <div className="flex-shrink-0">
        <BottomNav />
      </div>
    </div>
  );
};

const AppShell = () => (
  <ScrollProvider>
    <AppShellInner />
  </ScrollProvider>
);

export default AppShell;
