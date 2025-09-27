import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Animated } from 'react-native';
import { signUpStyles as styles } from '../styles/signUp.styles';

type NameStepProps = {
  titleOpacity: Animated.Value;
  titleScale: Animated.Value;
  titleTranslateY: Animated.Value;
  titleFinalScale: Animated.Value;
  titleFinalTranslateY: Animated.Value;
  subtitleOpacity: Animated.Value;
  subtitleTranslateY: Animated.Value;
  inputOpacity: Animated.Value;
  inputTranslateY: Animated.Value;
  buttonOpacity: Animated.Value;
  buttonTranslateY: Animated.Value;
  showFullScreen: boolean;
  firstName: string;
  setFirstName: (value: string) => void;
  onContinue: () => void;
};

export function NameStep({
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
  showFullScreen,
  firstName,
  setFirstName,
  onContinue,
}: NameStepProps) {
  return (
    <>
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
              onSubmitEditing={onContinue}
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
              onPress={onContinue}
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
    </>
  );
}
