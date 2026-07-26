import 'dotenv/config';
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.wayfinderlabs.btfm',
  appName: 'BT Field Manual',
  webDir: 'dist',
  android: {},
  plugins: {
    AdMob: {
      appId: process.env.ADMOB_APP_ID,
    },
    SplashScreen: {
      backgroundColor: '#0D0D0D',
      showSpinner: false,
      launchAutoHide: true,
      launchFadeOutDuration: 300,
    },
    Keyboard: {
      resize: 'body',
      style: 'dark',
    },
  },
};

export default config;
