import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ResultsScreen() {
  const params = useLocalSearchParams();
  const { firstName, zodiacData } = params;
  
  // Parse the zodiac data from the URL params
  const zodiac = zodiacData ? JSON.parse(zodiacData as string) : null;
  
  // Animation values
  const youAreOpacity = useRef(new Animated.Value(0)).current;
  const youAreTranslateY = useRef(new Animated.Value(20)).current;
  const iconOpacity = useRef(new Animated.Value(0)).current;
  const iconScale = useRef(new Animated.Value(0.5)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleScale = useRef(new Animated.Value(0.8)).current;
  const titleTranslateY = useRef(new Animated.Value(20)).current;
  const descriptionOpacity = useRef(new Animated.Value(0)).current;
  const descriptionTranslateY = useRef(new Animated.Value(30)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;
  const buttonTranslateY = useRef(new Animated.Value(30)).current;
  
  // Gradient animation values
  const gradientTranslateX = useRef(new Animated.Value(0)).current;
  const gradientTranslateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start gradient animation
    const gradientAnimation = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(gradientTranslateX, {
            toValue: 20,
            duration: 4000,
            useNativeDriver: true,
          }),
          Animated.timing(gradientTranslateY, {
            toValue: 15,
            duration: 4000,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(gradientTranslateX, {
            toValue: -10,
            duration: 3000,
            useNativeDriver: true,
          }),
          Animated.timing(gradientTranslateY, {
            toValue: -20,
            duration: 3000,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(gradientTranslateX, {
            toValue: 0,
            duration: 3500,
            useNativeDriver: true,
          }),
          Animated.timing(gradientTranslateY, {
            toValue: 0,
            duration: 3500,
            useNativeDriver: true,
          }),
        ]),
      ])
    );
    gradientAnimation.start();

    // Start entrance animation sequence
    Animated.sequence([
      // First, animate "YOU ARE A"
      Animated.parallel([
        Animated.timing(youAreOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(youAreTranslateY, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      // Then animate the icon
      Animated.parallel([
        Animated.timing(iconOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(iconScale, {
          toValue: 1,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
      // Then animate the title
      Animated.parallel([
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 600,
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
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      // Then animate the description
      Animated.parallel([
        Animated.timing(descriptionOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(descriptionTranslateY, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      // Finally animate the button
      Animated.parallel([
        Animated.timing(buttonOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(buttonTranslateY, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  const handleContinue = () => {
    // Navigate to the main app or next screen
    router.push('/');
  };

  if (!zodiac) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error loading results</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      {/* Full-screen animated gradient background */}
      <Animated.View 
        style={[
          styles.bgGradient,
          {
            transform: [
              { translateX: gradientTranslateX },
              { translateY: gradientTranslateY }
            ]
          }
        ]}
      >
        <LinearGradient
          colors={["rgba(78, 84, 200, 0.25)", "rgba(143, 148, 251, 0.10)", 'rgba(0,0,0,0.6)']}
          start={{ x: 0.1, y: 0 }}
          end={{ x: 0.9, y: 1 }}
          style={styles.gradientFill}
          pointerEvents="none"
        />
      </Animated.View>

      <View style={styles.content}>
        {/* "YOU ARE A" text */}
        <Animated.View 
          style={[
            styles.youAreContainer,
            {
              opacity: youAreOpacity,
              transform: [{ translateY: youAreTranslateY }]
            }
          ]}
        >
          <Text style={styles.youAreText}>YOU ARE A</Text>
        </Animated.View>

        {/* Large Icon */}
        <Animated.View 
          style={[
            styles.iconContainer,
            {
              opacity: iconOpacity,
              transform: [{ scale: iconScale }]
            }
          ]}
        >
          <Text style={styles.icon}>{zodiac.emoji}</Text>
        </Animated.View>

        {/* Archetype Title */}
        <Animated.View 
          style={[
            styles.titleContainer,
            {
              opacity: titleOpacity,
              transform: [
                { translateY: titleTranslateY },
                { scale: titleScale }
              ]
            }
          ]}
        >
          <Text style={styles.title}>{zodiac.name.toUpperCase()}</Text>
        </Animated.View>

        {/* Description */}
        <Animated.View 
          style={[
            styles.descriptionContainer,
            {
              opacity: descriptionOpacity,
              transform: [{ translateY: descriptionTranslateY }]
            }
          ]}
        >
          <Text style={styles.descriptionText}>
            {zodiac.traits}
          </Text>
        </Animated.View>

        {/* Continue Button */}
        <Animated.View 
          style={[
            styles.buttonContainer,
            {
              opacity: buttonOpacity,
              transform: [{ translateY: buttonTranslateY }]
            }
          ]}
        >
          <TouchableOpacity 
            activeOpacity={0.95} 
            style={styles.button}
            onPress={handleContinue}
          >
            <LinearGradient
              colors={["#4A90E2", "#7B68EE"]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>Continue my journey</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  bgGradient: {
    position: 'absolute',
    top: -50,
    left: -50,
    right: -50,
    bottom: -50,
  },
  gradientFill: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 120,
  },
  youAreContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  youAreText: {
    color: '#9aa0a6',
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center',
    letterSpacing: 1,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  icon: {
    fontSize: 100,
    textAlign: 'center',
    textShadowColor: '#ffa500',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 25,
  },
  title: {
    color: '#ffa500',
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 1,
    textShadowColor: '#ffa500',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  descriptionContainer: {
    width: '100%',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  descriptionText: {
    color: '#9aa0a6',
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'center',
    fontWeight: '400',
  },
  buttonContainer: {
    width: '100%',
  },
  button: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  buttonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
    borderRadius: 16,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 18,
  },
  errorText: {
    color: '#ffffff',
    fontSize: 18,
    textAlign: 'center',
  },
});
