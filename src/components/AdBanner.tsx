import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

const AdBanner = () => {
  const [hasAd, setHasAd] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // adsbygoogle not available yet — silent fail
    }

    // Observe the ins element for ad content
    const observer = new MutationObserver(() => {
      if (containerRef.current) {
        const ins = containerRef.current.querySelector("ins");
        if (ins && ins.childElementCount > 0) {
          setHasAd(true);
        }
      }
    });

    if (containerRef.current) {
      observer.observe(containerRef.current, { childList: true, subtree: true });
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      id="ad-slot-banner"
      className={`shrink-0 w-full border-border overflow-hidden transition-all ${
        hasAd ? "h-[50px] border-t bg-card" : "h-0"
      }`}
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
