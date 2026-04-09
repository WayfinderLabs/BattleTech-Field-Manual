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
  },
};

export default config;
