import { Outlet } from "react-router-dom";
import TopBar from "./TopBar";
import BottomNav from "./BottomNav";
import AdBanner from "./AdBanner";
import InstallPrompt from "./InstallPrompt";

const AppShell = () => {
  return (
    <div className="flex flex-col h-dvh overflow-hidden bg-background">
      <InstallPrompt />
      <div className="flex-shrink-0">
        <TopBar />
      </div>
      <main className="flex-1 min-h-0 overflow-y-auto">
        <div className="max-w-[480px] mx-auto px-4 py-4">
          <Outlet />
        </div>
      </main>
      <div className="flex-shrink-0">
        <AdBanner />
      </div>
      <div className="flex-shrink-0">
        <BottomNav />
      </div>
    </div>
  );
};

export default AppShell;
