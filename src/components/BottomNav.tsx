import { useLocation, useNavigate } from "react-router-dom";
import { Crosshair, Bot, Wrench } from "lucide-react";

const tabs = [
  { path: "/", label: "WEAPONS", icon: Crosshair },
  { path: "/mechs", label: "MECHS", icon: Bot },
  { path: "/equipment", label: "EQUIPMENT", icon: Wrench },
] as const;

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/" || location.pathname.startsWith("/weapons");
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border">
      <div className="max-w-[480px] mx-auto flex">
        {tabs.map(({ path, label, icon: Icon }) => {
          const active = isActive(path);
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`flex-1 flex flex-col items-center gap-1 py-2.5 transition-colors duration-150 active:scale-[0.97] ${
                active ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Icon className="w-5 h-5" strokeWidth={active ? 2.5 : 1.5} />
              <span className="font-mono tracking-wider" style={{ fontSize: 'var(--fs-nav)' }}>{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
