import { createContext, useContext, useRef } from "react";

const ScrollContext = createContext<React.RefObject<HTMLDivElement> | null>(null);

export const ScrollProvider = ({ children }: { children: React.ReactNode }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  return (
    <ScrollContext.Provider value={scrollContainerRef}>
      {children}
    </ScrollContext.Provider>
  );
};

export const useScrollContainer = () => {
  const ref = useContext(ScrollContext);
  if (!ref) throw new Error("useScrollContainer must be used within ScrollProvider");
  return ref;
};
