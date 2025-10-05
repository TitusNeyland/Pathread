import React from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { useSplashScreen } from '@/hooks/use-splash-screen';
import SplashScreenComponent from '@/app/screens/SplashScreen/SplashScreen';

// Removed anchor to ensure login is the initial screen

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { isAppReady, isSplashAnimationComplete, onSplashAnimationFinish } = useSplashScreen();
  const router = useRouter();
  const segments = useSegments();

  // Ensure we land on /login on first load
  React.useEffect(() => {
    if (isAppReady && isSplashAnimationComplete) {
      // Always navigate to login first, regardless of current route
      router.replace('/login');
    }
  }, [isAppReady, isSplashAnimationComplete, router]);

  if (!isAppReady || !isSplashAnimationComplete) {
    return (
      <SplashScreenComponent onAnimationFinish={onSplashAnimationFinish} />
    );
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="signup" options={{ headerShown: false }} />
        <Stack.Screen name="character" options={{ headerShown: false }} />
        <Stack.Screen name="home" options={{ headerShown: false }} />
        <Stack.Screen name="story-type" options={{ headerShown: false }} />
        <Stack.Screen name="tone-length" options={{ headerShown: false }} />
        <Stack.Screen name="pick-your-story" options={{ headerShown: false }} />
        <Stack.Screen name="story-reader" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
