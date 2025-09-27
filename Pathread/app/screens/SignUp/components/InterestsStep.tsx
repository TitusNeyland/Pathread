import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Animated } from 'react-native';
import { signUpStyles as styles } from '../styles/signUp.styles';
import { INTERESTS } from '../constants/interests';

type InterestsStepProps = {
  interestsTitleOpacity: Animated.Value;
  interestsTitleScale: Animated.Value;
  interestsTitleTranslateY: Animated.Value;
  interestsSubtitleOpacity: Animated.Value;
  interestsSubtitleTranslateY: Animated.Value;
  interestsGridOpacity: Animated.Value;
  interestsGridTranslateY: Animated.Value;
  interestsButtonOpacity: Animated.Value;
  interestsButtonTranslateY: Animated.Value;
  selectedInterests: string[];
  onToggleInterest: (interest: string) => void;
  onContinue: () => void;
};

export function InterestsStep({
  interestsTitleOpacity,
  interestsTitleScale,
  interestsTitleTranslateY,
  interestsSubtitleOpacity,
  interestsSubtitleTranslateY,
  interestsGridOpacity,
  interestsGridTranslateY,
  interestsButtonOpacity,
  interestsButtonTranslateY,
  selectedInterests,
  onToggleInterest,
  onContinue,
}: InterestsStepProps) {
  return (
    <>
      {/* Title */}
      <Animated.View 
        style={[
          styles.interestsTitleContainer,
          {
            opacity: interestsTitleOpacity,
            transform: [
              { translateY: interestsTitleTranslateY },
              { scale: interestsTitleScale }
            ]
          }
        ]}
      >
        <Text style={styles.interestsTitle}>What are your interests?</Text>
      </Animated.View>

      {/* Subtitle */}
      <Animated.View 
        style={[
          styles.interestsSubtitleContainer,
          {
            opacity: interestsSubtitleOpacity,
            transform: [{ translateY: interestsSubtitleTranslateY }]
          }
        ]}
      >
        <Text style={styles.interestsSubtitle}>
          Choose at least 3 and up to 10 to personalize your journey.
        </Text>
      </Animated.View>

      {/* Interests Grid */}
      <Animated.View 
        style={[
          styles.interestsGridContainer,
          {
            opacity: interestsGridOpacity,
            transform: [{ translateY: interestsGridTranslateY }]
          }
        ]}
      >
        <ScrollView 
          style={styles.interestsScrollView}
          showsVerticalScrollIndicator={false}
          bounces={false}
          contentContainerStyle={styles.interestsScrollContent}
        >
          <View style={styles.interestsGrid}>
            {INTERESTS.map((interest) => (
              <TouchableOpacity
                key={interest}
                style={[
                  styles.interestTag,
                  selectedInterests.includes(interest) && styles.selectedInterestTag
                ]}
                onPress={() => onToggleInterest(interest)}
                activeOpacity={0.8}
              >
                <Text style={[
                  styles.interestText,
                  selectedInterests.includes(interest) && styles.selectedInterestText
                ]}>
                  {interest}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </Animated.View>

      {/* Continue Button */}
      <Animated.View 
        style={[
          styles.buttonContainer,
          {
            opacity: interestsButtonOpacity,
            transform: [{ translateY: interestsButtonTranslateY }]
          }
        ]}
      >
        <TouchableOpacity 
          activeOpacity={0.95} 
          style={[
            styles.button,
            selectedInterests.length < 3 && styles.disabledButton
          ]}
          onPress={onContinue}
          disabled={selectedInterests.length < 3}
        >
          <LinearGradient
            colors={selectedInterests.length >= 3 ? ["#4A90E2", "#7B68EE"] : ["#666", "#666"]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>
              {selectedInterests.length < 3 
                ? `Choose ${3 - selectedInterests.length} more` 
                : 'Continue'
              }
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </>
  );
}
