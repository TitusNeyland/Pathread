import { useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';

export function useSplashScreen() {
  const [isAppReady, setAppReady] = useState(false);
  const [isSplashAnimationComplete, setSplashAnimationComplete] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Hide the native splash screen immediately
        await SplashScreen.hideAsync();
        
        // Pre-load fonts, make any API calls you need to do here
        // await Font.loadAsync({
        //   ...FontAwesome.font,
        // });
        
        // Artificially delay for demo purposes
        await new Promise(resolve => setTimeout(resolve, 3500));
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppReady(true);
      }
    }

    prepare();
  }, []);

  const onSplashAnimationFinish = () => {
    setSplashAnimationComplete(true);
  };

  return {
    isAppReady,
    isSplashAnimationComplete,
    onSplashAnimationFinish,
  };
}
