import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, StatusBar, Text } from 'react-native';

interface SplashScreenProps {
  onAnimationFinish?: () => void;
}

export default function SplashScreen({ onAnimationFinish }: SplashScreenProps) {
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.6)).current;
  const translateYAnim = useRef(new Animated.Value(-40)).current;

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
      onAnimationFinish?.();
    });
  }, [opacityAnim, scaleAnim, translateYAnim, letterOpacity, letterScale, letterTranslate, letters, onAnimationFinish]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <Animated.View
        style={[
          styles.titleRow,
          { opacity: opacityAnim, transform: [{ translateY: translateYAnim }, { scale: scaleAnim }] },
        ]}
      >
        {letters.map((ch, i) => (
          <Animated.Text
            key={`l-${i}-${ch}`}
            style={[
              styles.title,
              {
                opacity: letterOpacity[i],
                transform: [
                  { translateY: letterTranslate[i] },
                  { scale: letterScale[i] },
                ],
              },
            ]}
            accessibilityRole={i === 0 ? 'header' : undefined}
          >
            {ch}
          </Animated.Text>
        ))}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
  },
  title: {
    color: '#ffffff',
    fontSize: 40,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'lowercase',
  },
});
