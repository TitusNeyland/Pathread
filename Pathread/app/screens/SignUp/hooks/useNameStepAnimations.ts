import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

export function useNameStepAnimations() {
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleScale = useRef(new Animated.Value(0.8)).current;
  const titleTranslateY = useRef(new Animated.Value(20)).current;
  const titleFinalScale = useRef(new Animated.Value(1)).current;
  const titleFinalTranslateY = useRef(new Animated.Value(1)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const subtitleTranslateY = useRef(new Animated.Value(20)).current;
  const inputOpacity = useRef(new Animated.Value(0)).current;
  const inputTranslateY = useRef(new Animated.Value(30)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;
  const buttonTranslateY = useRef(new Animated.Value(30)).current;

  // Start with just "Who are you?" animation
  useEffect(() => {
    Animated.parallel([
      Animated.timing(titleOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(titleScale, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(titleTranslateY, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const enterRest = () => {
    Animated.parallel([
      // Animate title to final position (smaller and higher)
      Animated.timing(titleFinalScale, {
        toValue: 0.7,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(titleFinalTranslateY, {
        toValue: -40,
        duration: 600,
        useNativeDriver: true,
      }),
      // Show rest of content
      Animated.timing(subtitleOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(subtitleTranslateY, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(inputOpacity, {
        toValue: 1,
        duration: 600,
        delay: 200,
        useNativeDriver: true,
      }),
      Animated.timing(inputTranslateY, {
        toValue: 0,
        duration: 600,
        delay: 200,
        useNativeDriver: true,
      }),
      Animated.timing(buttonOpacity, {
        toValue: 1,
        duration: 600,
        delay: 400,
        useNativeDriver: true,
      }),
      Animated.timing(buttonTranslateY, {
        toValue: 0,
        duration: 600,
        delay: 400,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const exit = () => {
    return new Promise<void>((resolve) => {
      Animated.parallel([
        Animated.timing(titleOpacity, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(subtitleOpacity, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(inputOpacity, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(buttonOpacity, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start(() => resolve());
    });
  };

  return {
    titleOpacity,
    titleScale,
    titleTranslateY,
    titleFinalScale,
    titleFinalTranslateY,
    subtitleOpacity,
    subtitleTranslateY,
    inputOpacity,
    inputTranslateY,
    buttonOpacity,
    buttonTranslateY,
    enterRest,
    exit,
  };
}
