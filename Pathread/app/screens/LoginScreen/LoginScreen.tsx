import React, { useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StatusBar, Platform, KeyboardAvoidingView, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { styles } from './styles/login.styles';

export default function LoginScreen() {
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleScale = useRef(new Animated.Value(0.8)).current;
  const titleTranslateY = useRef(new Animated.Value(20)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const cardTranslateY = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    // Start entrance animation immediately
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
      Animated.timing(cardOpacity, {
        toValue: 1,
        duration: 800,
        delay: 200,
        useNativeDriver: true,
      }),
      Animated.timing(cardTranslateY, {
        toValue: 0,
        duration: 800,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [titleOpacity, titleScale, titleTranslateY, cardOpacity, cardTranslateY]);

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

      <Animated.View 
        style={[
          styles.header,
          {
            opacity: titleOpacity,
            transform: [
              { translateY: titleTranslateY },
              { scale: titleScale }
            ]
          }
        ]}
      >
        <Text style={styles.title}>pathread.</Text>
        <Text style={styles.subtitle}>Build your story</Text>
      </Animated.View>

      <Animated.View 
        style={[
          styles.card,
          {
            opacity: cardOpacity,
            transform: [{ translateY: cardTranslateY }]
          }
        ]}
      >
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Email or username</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              placeholder="Enter your email or username"
              placeholderTextColor="#7a7f85"
              style={styles.input}
              autoCapitalize="none"
              keyboardType="email-address"
              returnKeyType="next"
            />
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              placeholder="Enter your password"
              placeholderTextColor="#7a7f85"
              style={styles.input}
              secureTextEntry
              returnKeyType="go"
            />
            <TouchableOpacity style={styles.inputIcon} activeOpacity={0.8}>
              <Ionicons name="scan-outline" size={22} color="#9aa0a6" />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity activeOpacity={0.95} style={styles.button}>
           <LinearGradient
             colors={["#4A90E2", "#7B68EE"]}
             start={{ x: 0, y: 0.5 }}
             end={{ x: 1, y: 0.5 }}
             style={styles.buttonGradient}
           >
            <Text style={styles.buttonText}>Log in</Text>
          </LinearGradient>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          Not a user? <Text style={styles.link} onPress={() => router.push('/signup')}>Sign up</Text>
        </Text>
      </Animated.View>

      <Text style={styles.bottomHint}>Start your reading journey with Pathread</Text>
    </KeyboardAvoidingView>
  );
}

