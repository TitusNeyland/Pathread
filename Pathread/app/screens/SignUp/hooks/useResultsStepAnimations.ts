import { useRef } from 'react';
import { Animated } from 'react-native';

export function useResultsStepAnimations() {
  const resultsYouAreOpacity = useRef(new Animated.Value(0)).current;
  const resultsYouAreTranslateY = useRef(new Animated.Value(20)).current;
  const resultsIconOpacity = useRef(new Animated.Value(0)).current;
  const resultsIconScale = useRef(new Animated.Value(0.5)).current;
  const resultsTitleOpacity = useRef(new Animated.Value(0)).current;
  const resultsTitleScale = useRef(new Animated.Value(0.8)).current;
  const resultsTitleTranslateY = useRef(new Animated.Value(20)).current;
  const resultsDescriptionOpacity = useRef(new Animated.Value(0)).current;
  const resultsDescriptionTranslateY = useRef(new Animated.Value(30)).current;
  const resultsButtonOpacity = useRef(new Animated.Value(0)).current;
  const resultsButtonTranslateY = useRef(new Animated.Value(30)).current;

  const enter = () => {
    // Start results animations
    Animated.sequence([
      // First, animate "YOU ARE A"
      Animated.parallel([
        Animated.timing(resultsYouAreOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(resultsYouAreTranslateY, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      // Then animate the icon
      Animated.parallel([
        Animated.timing(resultsIconOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(resultsIconScale, {
          toValue: 1,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
      // Then animate the title
      Animated.parallel([
        Animated.timing(resultsTitleOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(resultsTitleScale, {
          toValue: 1,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(resultsTitleTranslateY, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      // Then animate the description
      Animated.parallel([
        Animated.timing(resultsDescriptionOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(resultsDescriptionTranslateY, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      // Finally animate the button
      Animated.parallel([
        Animated.timing(resultsButtonOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(resultsButtonTranslateY, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  };

  const exit = () => {
    return new Promise<void>((resolve) => {
      Animated.parallel([
        Animated.timing(resultsYouAreOpacity, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(resultsIconOpacity, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(resultsTitleOpacity, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(resultsDescriptionOpacity, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(resultsButtonOpacity, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start(() => resolve());
    });
  };

  return {
    resultsYouAreOpacity,
    resultsYouAreTranslateY,
    resultsIconOpacity,
    resultsIconScale,
    resultsTitleOpacity,
    resultsTitleScale,
    resultsTitleTranslateY,
    resultsDescriptionOpacity,
    resultsDescriptionTranslateY,
    resultsButtonOpacity,
    resultsButtonTranslateY,
    enter,
    exit,
  };
}
