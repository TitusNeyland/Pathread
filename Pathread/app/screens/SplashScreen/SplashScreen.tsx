import React, { useEffect, useRef } from 'react';
import { View, Animated, StatusBar, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { styles } from './styles/splash.styles';

interface SplashScreenProps {
  onAnimationFinish?: () => void;
}

export default function SplashScreen({ onAnimationFinish }: SplashScreenProps) {
  const router = useRouter();
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.6)).current;
  const translateYAnim = useRef(new Animated.Value(-40)).current;
  const exitAnim = useRef(new Animated.Value(1)).current;

  const title = 'pathread.';
  const letters = title.split('');
  const letterTranslate = useRef(letters.map(() => new Animated.Value(-20))).current;
  const letterScale = useRef(letters.map(() => new Animated.Value(0.8))).current;
  const letterOpacity = useRef(letters.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    const base = Animated.parallel([
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 70,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.spring(translateYAnim, {
        toValue: 0,
        tension: 70,
        friction: 9,
        useNativeDriver: true,
      }),
    ]);

    const perLetter = Animated.stagger(
      70,
      letters.map((_, i) =>
        Animated.parallel([
          Animated.timing(letterOpacity[i], {
            toValue: 1,
            duration: 180,
            useNativeDriver: true,
          }),
          Animated.spring(letterTranslate[i], {
            toValue: 0,
            tension: 80,
            friction: 6,
            useNativeDriver: true,
          }),
          Animated.spring(letterScale[i], {
            toValue: 1,
            tension: 80,
            friction: 6,
            useNativeDriver: true,
          }),
        ])
      )
    );

    Animated.sequence([base, perLetter]).start(() => {
      // Start exit animation before transitioning
      Animated.timing(exitAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }).start(() => {
        onAnimationFinish?.();
      });
    });
  }, [opacityAnim, scaleAnim, translateYAnim, letterOpacity, letterScale, letterTranslate, letters, onAnimationFinish]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <Animated.View
        style={[
          styles.titleRow,
          { 
            opacity: Animated.multiply(opacityAnim, exitAnim), 
            transform: [
              { translateY: translateYAnim }, 
              { scale: Animated.multiply(scaleAnim, exitAnim) }
            ] 
          },
        ]}
      >
        {letters.map((ch, i) => (
          <Animated.Text
            key={`l-${i}-${ch}`}
            style={[
              styles.title,
              {
                opacity: Animated.multiply(letterOpacity[i], exitAnim),
                transform: [
                  { translateY: letterTranslate[i] },
                  { scale: Animated.multiply(letterScale[i], exitAnim) },
                ],
              },
            ]}
            accessibilityRole={i === 0 ? 'header' : undefined}
          >
            {ch}
          </Animated.Text>
        ))}
      </Animated.View>

      <Animated.Text style={[styles.footer, { opacity: exitAnim }]}>© 2025 Titus Neyland</Animated.Text>
    </View>
  );
}

