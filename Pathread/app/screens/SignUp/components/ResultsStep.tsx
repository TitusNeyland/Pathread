import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Animated } from 'react-native';
import { signUpStyles as styles } from '../styles/signUp.styles';

type ZodiacResult = {
  signName: string;
  emoji: string;
  name: string;
  traits: string;
  archetype: string;
};

type ResultsStepProps = {
  resultsYouAreOpacity: Animated.Value;
  resultsYouAreTranslateY: Animated.Value;
  resultsIconOpacity: Animated.Value;
  resultsIconScale: Animated.Value;
  resultsTitleOpacity: Animated.Value;
  resultsTitleScale: Animated.Value;
  resultsTitleTranslateY: Animated.Value;
  resultsDescriptionOpacity: Animated.Value;
  resultsDescriptionTranslateY: Animated.Value;
  resultsButtonOpacity: Animated.Value;
  resultsButtonTranslateY: Animated.Value;
  zodiacResult: ZodiacResult | null;
  onContinue: () => void;
};

export function ResultsStep({
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
  zodiacResult,
  onContinue,
}: ResultsStepProps) {
  if (!zodiacResult) return null;

  return (
    <>
      {/* "YOU ARE A" text */}
      <Animated.View 
        style={[
          styles.youAreContainer,
          {
            opacity: resultsYouAreOpacity,
            transform: [{ translateY: resultsYouAreTranslateY }]
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
            opacity: resultsIconOpacity,
            transform: [{ scale: resultsIconScale }]
          }
        ]}
      >
        <Text style={styles.icon}>{zodiacResult.emoji}</Text>
      </Animated.View>

      {/* Archetype Title */}
      <Animated.View 
        style={[
          styles.resultsTitleContainer,
          {
            opacity: resultsTitleOpacity,
            transform: [
              { translateY: resultsTitleTranslateY },
              { scale: resultsTitleScale }
            ]
          }
        ]}
      >
        <Text style={styles.resultsTitle}>{zodiacResult.name.toUpperCase()}</Text>
      </Animated.View>

      {/* Description */}
      <Animated.View 
        style={[
          styles.descriptionContainer,
          {
            opacity: resultsDescriptionOpacity,
            transform: [{ translateY: resultsDescriptionTranslateY }]
          }
        ]}
      >
        <Text style={styles.descriptionText}>
          {zodiacResult.traits}
        </Text>
      </Animated.View>

      {/* Continue Button */}
      <Animated.View 
        style={[
          styles.buttonContainer,
          {
            opacity: resultsButtonOpacity,
            transform: [{ translateY: resultsButtonTranslateY }]
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
            <Text style={styles.buttonText}>Continue my journey</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </>
  );
}
