import { useEffect, useRef, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const InstallPrompt = () => {
  const deferredPrompt = useRef<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      deferredPrompt.current = e as BeforeInstallPromptEvent;
      if (!localStorage.getItem("pwa-install-dismissed")) {
        setShowBanner(true);
      }
    };

    const handleAppInstalled = () => {
      setShowBanner(false);
      localStorage.removeItem("pwa-install-dismissed");
      deferredPrompt.current = null;
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt.current) {
      await deferredPrompt.current.prompt();
      setShowBanner(false);
    }
  };

  const handleDismiss = () => {
    localStorage.setItem("pwa-install-dismissed", "1");
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4"
      style={{
        height: "56px",
        backgroundColor: "#1A1A1A",
        borderBottom: "1px solid #C87941",
      }}
    >
      <span
        className="font-mono uppercase text-xs tracking-widest"
        style={{ color: "#C87941" }}
      >
        INSTALL APP
      </span>
      <div className="flex gap-2">
        <button
          onClick={handleInstall}
          className="font-mono uppercase text-xs px-3 py-1 rounded-sm"
          style={{
            border: "1px solid #C87941",
            color: "#C87941",
            background: "transparent",
          }}
        >
          INSTALL
        </button>
        <button
          onClick={handleDismiss}
          className="font-mono uppercase text-xs px-3 py-1 rounded-sm"
          style={{
            border: "1px solid #8A8A8A",
            color: "#8A8A8A",
            background: "transparent",
          }}
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default InstallPrompt;
