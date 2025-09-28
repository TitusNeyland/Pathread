import { useRef } from 'react';
import { Animated } from 'react-native';

export function useInterestsStepAnimations() {
  const interestsTitleOpacity = useRef(new Animated.Value(0)).current;
  const interestsTitleScale = useRef(new Animated.Value(0.8)).current;
  const interestsTitleTranslateY = useRef(new Animated.Value(20)).current;
  const interestsSubtitleOpacity = useRef(new Animated.Value(0)).current;
  const interestsSubtitleTranslateY = useRef(new Animated.Value(20)).current;
  const interestsGridOpacity = useRef(new Animated.Value(0)).current;
  const interestsGridTranslateY = useRef(new Animated.Value(30)).current;
  const interestsButtonOpacity = useRef(new Animated.Value(0)).current;
  const interestsButtonTranslateY = useRef(new Animated.Value(30)).current;

  const enter = () => {
    // Start interests animations
    Animated.sequence([
      // First, animate the title
      Animated.parallel([
        Animated.timing(interestsTitleOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(interestsTitleScale, {
          toValue: 1,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(interestsTitleTranslateY, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      // Then animate the subtitle
      Animated.parallel([
        Animated.timing(interestsSubtitleOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(interestsSubtitleTranslateY, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      // Then animate the grid
      Animated.parallel([
        Animated.timing(interestsGridOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(interestsGridTranslateY, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      // Finally animate the button
      Animated.parallel([
        Animated.timing(interestsButtonOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(interestsButtonTranslateY, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  };

  return {
    interestsTitleOpacity,
    interestsTitleScale,
    interestsTitleTranslateY,
    interestsSubtitleOpacity,
    interestsSubtitleTranslateY,
    interestsGridOpacity,
    interestsGridTranslateY,
    interestsButtonOpacity,
    interestsButtonTranslateY,
    enter,
  };
}
