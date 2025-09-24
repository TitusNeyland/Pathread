import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, StatusBar, Platform, KeyboardAvoidingView, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

export default function SignUpScreen() {
  const [showFullScreen, setShowFullScreen] = useState(false);
  const [firstName, setFirstName] = useState('');
  
  // Animation values
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

  useEffect(() => {
    // Start with just "Who are you?" animation
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

    // After 3 seconds, show the rest of the screen
    const timer = setTimeout(() => {
      setShowFullScreen(true);
      
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
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleContinue = () => {
    if (firstName.trim()) {
      // Navigate to next screen or handle signup logic
      console.log('First name:', firstName);
      // router.push('/next-screen');
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.select({ ios: 'padding', default: undefined })}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      {/* Full-screen animated gradient background */}
      <LinearGradient
        colors={["rgba(78, 84, 200, 0.25)", "rgba(143, 148, 251, 0.10)", 'rgba(0,0,0,0.6)']}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={styles.bgGradient}
        pointerEvents="none"
      />

      <View style={styles.content}>
        {/* Title Animation */}
        <Animated.View 
          style={[
            styles.titleContainer,
            {
              opacity: titleOpacity,
              transform: [
                { translateY: Animated.add(titleTranslateY, titleFinalTranslateY) },
                { scale: Animated.multiply(titleScale, titleFinalScale) }
              ]
            }
          ]}
        >
          <Text style={styles.whoAreYou}>Who are you?</Text>
        </Animated.View>

        {/* Rest of the screen - animated in after delay */}
        {showFullScreen && (
          <>
            <Animated.View 
              style={[
                styles.subtitleContainer,
                {
                  opacity: subtitleOpacity,
                  transform: [{ translateY: subtitleTranslateY }]
                }
              ]}
            >
              <Text style={styles.subtitle}>
                Tell us your name to personalize your journey.
              </Text>
            </Animated.View>

            <Animated.View 
              style={[
                styles.formContainer,
                {
                  opacity: inputOpacity,
                  transform: [{ translateY: inputTranslateY }]
                }
              ]}
            >
              <TextInput
                placeholder="First name"
                placeholderTextColor="#7a7f85"
                style={styles.input}
                value={firstName}
                onChangeText={setFirstName}
                autoCapitalize="words"
                returnKeyType="done"
                onSubmitEditing={handleContinue}
              />
            </Animated.View>

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
                  <Text style={styles.buttonText}>Continue</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          </>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  bgGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'lowercase',
    marginBottom: 8,
  },
  whoAreYou: {
    color: '#ffffff',
    fontSize: 36,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitleContainer: {
    alignItems: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  subtitle: {
    color: '#9aa0a6',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  formContainer: {
    width: '100%',
    marginBottom: 24,
  },
  input: {
    backgroundColor: 'rgba(15,15,18,0.8)',
    borderWidth: 1,
    borderColor: 'rgba(120,130,150,0.3)',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 18,
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
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
});
