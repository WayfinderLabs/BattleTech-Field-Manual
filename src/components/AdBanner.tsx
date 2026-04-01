import { useEffect } from "react";

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

const AdBanner = () => {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // adsbygoogle not available yet — silent fail
    }
  }, []);

  return (
    <div
      id="ad-slot-banner"
      className="fixed bottom-[52px] left-0 right-0 z-40 w-full h-[50px] bg-card border-t border-border overflow-hidden"
    >
      <ins
        className="adsbygoogle"
        style={{ display: "block", width: "100%", height: "50px" }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
        data-ad-slot="XXXXXXXXXX"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
};

export default AdBanner;
