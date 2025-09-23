import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, StatusBar, Text } from 'react-native';

interface SplashScreenProps {
  onAnimationFinish?: () => void;
}

export default function SplashScreen({ onAnimationFinish }: SplashScreenProps) {
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.96)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 60,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onAnimationFinish?.();
    });
  }, [opacityAnim, scaleAnim, onAnimationFinish]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <Animated.Text
        style={[
          styles.title,
          { opacity: opacityAnim, transform: [{ scale: scaleAnim }] },
        ]}
      >
        pathread.
      </Animated.Text>
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
  title: {
    color: '#ffffff',
    fontSize: 40,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'lowercase',
  },
});
