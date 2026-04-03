import { Outlet } from "react-router-dom";
import TopBar from "./TopBar";
import BottomNav from "./BottomNav";
import AdBanner from "./AdBanner";
import InstallPrompt from "./InstallPrompt";

const AppShell = () => {
  return (
    <div className="flex flex-col h-dvh overflow-hidden bg-background">
      <InstallPrompt />
      <TopBar />
      <main className="flex-1 min-h-0 overflow-y-auto">
        <div className="max-w-[480px] mx-auto px-4 py-4">
          <Outlet />
        </div>
      </main>
      <AdBanner />
      <BottomNav />
    </div>
  );
};

export default AppShell;
