import { Outlet } from "react-router-dom";
import TopBar from "./TopBar";
import BottomNav from "./BottomNav";
import AdBanner from "./AdBanner";
import InstallPrompt from "./InstallPrompt";

const AppShell = () => {
  return (
    <div className="bg-background" style={{ minHeight: '100dvh' }}>
      <InstallPrompt />
      <TopBar />
      <main className="max-w-[480px] mx-auto px-4 pt-14 pb-[120px]">
        <Outlet />
      </main>
      <AdBanner />
      <BottomNav />
    </div>
  );
};

export default AppShell;
