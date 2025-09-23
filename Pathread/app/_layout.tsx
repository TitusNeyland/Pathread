import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { useSplashScreen } from '@/hooks/use-splash-screen';
import SplashScreenComponent from '@/components/splash-screen';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { isAppReady, isSplashAnimationComplete, onSplashAnimationFinish } = useSplashScreen();

  if (!isAppReady || !isSplashAnimationComplete) {
    return (
      <SplashScreenComponent onAnimationFinish={onSplashAnimationFinish} />
    );
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
