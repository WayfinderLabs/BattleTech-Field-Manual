import { createContext, useContext, useRef, useCallback } from 'react';

type GuardFn = (action: () => void) => void;

interface LoadoutDirtyContextValue {
  registerGuard: (fn: GuardFn | null) => void;
  requestNavigate: (action: () => void) => void;
}

const LoadoutDirtyContext = createContext<LoadoutDirtyContextValue>({
  registerGuard: () => {},
  requestNavigate: (action) => action(),
});

export const useLoadoutDirty = () => useContext(LoadoutDirtyContext);

export const LoadoutDirtyProvider = ({ children }: { children: React.ReactNode }) => {
  const guardRef = useRef<GuardFn | null>(null);

  const registerGuard = useCallback((fn: GuardFn | null) => {
    guardRef.current = fn;
  }, []);

  const requestNavigate = useCallback((action: () => void) => {
    if (guardRef.current) {
      guardRef.current(action);
    } else {
      action();
    }
  }, []);

  return (
    <LoadoutDirtyContext.Provider value={{ registerGuard, requestNavigate }}>
      {children}
    </LoadoutDirtyContext.Provider>
  );
};
