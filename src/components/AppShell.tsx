import { Outlet } from "react-router-dom";
import TopBar from "./TopBar";
import BottomNav from "./BottomNav";

const AppShell = () => {
  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <main className="max-w-[480px] mx-auto px-4 pt-14 pb-20">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
};

export default AppShell;
