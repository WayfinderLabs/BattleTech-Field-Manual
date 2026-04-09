import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.wayfinderlabs.btfm',
  appName: 'BT Field Manual',
  webDir: 'dist',
  android: {
    buildOptions: {
      minSdkVersion: 24,
      targetSdkVersion: 35,
    }
  },
  plugins: {
    AdMob: {
      appId: 'ca-app-pub-6177451660679409~5580272571',
    },
    SplashScreen: {
      backgroundColor: '#0D0D0D',
      showSpinner: false,
      launchAutoHide: true,
      launchFadeOutDuration: 300,
    },
  },
};

export default config;
