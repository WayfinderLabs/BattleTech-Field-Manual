import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { toast } from 'sonner';
import { useLoadoutDirty } from '@/contexts/LoadoutDirtyContext';

const LIST_ROUTES = ['/', '/mechs', '/equipment'];

const isListRoute = (path: string) => LIST_ROUTES.includes(path);
const isWeaponDetail = (path: string) => /^\/weapons\/[^/]+$/.test(path);
const isMechDetail = (path: string) => /^\/mechs\/[^/]+$/.test(path);
const isEquipmentDetail = (path: string) => /^\/equipment\/[^/]+$/.test(path);

const BackButtonHandler = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { requestNavigate } = useLoadoutDirty();

  const pathRef = useRef(location.pathname);
  const lastTabRef = useRef<string>('/');
  const exitPromptRef = useRef<number | null>(null);

  useEffect(() => {
    pathRef.current = location.pathname;
    if (isListRoute(location.pathname)) {
      lastTabRef.current = location.pathname;
    }
  }, [location.pathname]);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    let handle: { remove: () => void } | undefined;

    const handler = (event: { canGoBack: boolean }) => {
      // Suppress WebView default back handling entirely
      // All navigation is handled explicitly below

      const path = pathRef.current;

      if (isWeaponDetail(path)) {
        navigate('/');
        return;
      }
      if (isMechDetail(path)) {
        navigate('/mechs');
        return;
      }

      if (path === '/loadout') {
        requestNavigate(() => navigate(lastTabRef.current || '/'));
        return;
      }

      if (path === '/saved-loadouts') {
        navigate('/loadout');
        return;
      }

      if (isListRoute(path)) {
        const now = Date.now();
        if (exitPromptRef.current && now - exitPromptRef.current < 2000) {
          exitPromptRef.current = null;
          App.exitApp();
          return;
        }
        exitPromptRef.current = now;
        toast('Press back again to exit');
        window.setTimeout(() => {
          if (exitPromptRef.current && Date.now() - exitPromptRef.current >= 2000) {
            exitPromptRef.current = null;
          }
        }, 2100);
        return;
      }

      navigate(lastTabRef.current || '/');
    };

    App.addListener('backButton', handler).then((h) => {
      handle = h;
    });

    return () => {
      handle?.remove();
    };
  }, [navigate, requestNavigate]);

  return null;
};

export default BackButtonHandler;
