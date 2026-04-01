import { Outlet } from "react-router-dom";
import TopBar from "./TopBar";
import BottomNav from "./BottomNav";
import AdBanner from "./AdBanner";

const AppShell = () => {
  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <main className="max-w-[480px] mx-auto px-4 pt-14 pb-[120px]">
        <Outlet />
      </main>
      {/* AdMob banner slot - activate in Phase 3 */}
      <div
        id="ad-slot-banner"
        className="fixed bottom-[52px] left-0 right-0 z-40 h-[50px] w-full bg-transparent"
      />
      <BottomNav />
    </div>
  );
};

export default AppShell;
