import { useRef } from 'react';
import { Animated } from 'react-native';

export function useBirthdayStepAnimations() {
  const birthdayTitleOpacity = useRef(new Animated.Value(0)).current;
  const birthdayTitleScale = useRef(new Animated.Value(0.8)).current;
  const birthdayTitleTranslateY = useRef(new Animated.Value(20)).current;
  const birthdaySubtitleOpacity = useRef(new Animated.Value(0)).current;
  const birthdaySubtitleTranslateY = useRef(new Animated.Value(20)).current;
  const birthdayInputOpacity = useRef(new Animated.Value(0)).current;
  const birthdayInputTranslateY = useRef(new Animated.Value(30)).current;
  const birthdayButtonOpacity = useRef(new Animated.Value(0)).current;
  const birthdayButtonTranslateY = useRef(new Animated.Value(30)).current;

  const enter = () => {
    // Start birthday animations
    Animated.parallel([
      Animated.timing(birthdayTitleOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(birthdayTitleScale, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(birthdayTitleTranslateY, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // After 1 second, show the rest of birthday content
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(birthdaySubtitleOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(birthdaySubtitleTranslateY, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(birthdayInputOpacity, {
          toValue: 1,
          duration: 600,
          delay: 200,
          useNativeDriver: true,
        }),
        Animated.timing(birthdayInputTranslateY, {
          toValue: 0,
          duration: 600,
          delay: 200,
          useNativeDriver: true,
        }),
        Animated.timing(birthdayButtonOpacity, {
          toValue: 1,
          duration: 600,
          delay: 400,
          useNativeDriver: true,
        }),
        Animated.timing(birthdayButtonTranslateY, {
          toValue: 0,
          duration: 600,
          delay: 400,
          useNativeDriver: true,
        }),
      ]).start();
    }, 1000);
  };

  const exit = () => {
    return new Promise<void>((resolve) => {
      Animated.parallel([
        Animated.timing(birthdayTitleOpacity, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(birthdaySubtitleOpacity, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(birthdayInputOpacity, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(birthdayButtonOpacity, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start(() => resolve());
    });
  };

  return {
    birthdayTitleOpacity,
    birthdayTitleScale,
    birthdayTitleTranslateY,
    birthdaySubtitleOpacity,
    birthdaySubtitleTranslateY,
    birthdayInputOpacity,
    birthdayInputTranslateY,
    birthdayButtonOpacity,
    birthdayButtonTranslateY,
    enter,
    exit,
  };
}
