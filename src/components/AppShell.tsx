import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Capacitor } from "@capacitor/core";
import { StatusBar, Style } from "@capacitor/status-bar";
import TopBar from "./TopBar";
import BottomNav from "./BottomNav";
import InstallPrompt from "./InstallPrompt";
import { ScrollProvider, useScrollContainer } from "@/contexts/ScrollContext";
import { RewardedAdProvider } from "@/contexts/RewardedAdContext";
import { useConsentFlow } from "@/hooks/useConsentFlow";

const AppShellInner = () => {
  const scrollContainerRef = useScrollContainer();
  useConsentFlow();

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
    <div className="flex flex-col h-dvh overflow-hidden bg-background" style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <InstallPrompt />
      <div className="flex-shrink-0">
        <TopBar />
      </div>
      <main ref={scrollContainerRef} className="flex-1 min-h-0 overflow-y-auto overscroll-y-contain">
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
  <RewardedAdProvider>
    <ScrollProvider>
      <AppShellInner />
    </ScrollProvider>
  </RewardedAdProvider>
);

export default AppShell;
