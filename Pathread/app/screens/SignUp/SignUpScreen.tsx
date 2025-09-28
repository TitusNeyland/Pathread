import React, { useEffect, useState } from 'react';
import { View, StatusBar, Platform, KeyboardAvoidingView, Keyboard } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { PanGestureHandler, State, GestureHandlerRootView } from 'react-native-gesture-handler';
import { signUpStyles as styles } from './styles/signUp.styles';
import { NameStep } from './components/NameStep';
import { BirthdayStep } from './components/BirthdayStep';
import { ResultsStep } from './components/ResultsStep';
import { InterestsStep } from './components/InterestsStep';
import { MONTHS } from './constants/months';
import { getZodiacSign } from './constants/zodiac';
import { useNameStepAnimations } from './hooks/useNameStepAnimations';
import { useBirthdayStepAnimations } from './hooks/useBirthdayStepAnimations';
import { useResultsStepAnimations } from './hooks/useResultsStepAnimations';
import { useInterestsStepAnimations } from './hooks/useInterestsStepAnimations';

type Step = 'name' | 'birthday' | 'results' | 'interests';

type ZodiacResult = {
  signName: string;
  emoji: string;
  name: string;
  traits: string;
  archetype: string;
};

export default function SignUpScreen() {
  const [currentStep, setCurrentStep] = useState<Step>('name');
  const [showFullScreen, setShowFullScreen] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [showMonthModal, setShowMonthModal] = useState(false);
  const [showDayModal, setShowDayModal] = useState(false);
  const [zodiacResult, setZodiacResult] = useState<ZodiacResult | null>(null);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [zodiacSign, setZodiacSign] = useState<string>('');

  // Animation hooks
  const nameAnim = useNameStepAnimations();
  const birthdayAnim = useBirthdayStepAnimations();
  const resultsAnim = useResultsStepAnimations();
  const interestsAnim = useInterestsStepAnimations();

  useEffect(() => {
    // Start with just "Who are you?" animation
    // After 3 seconds, show the rest of the screen
    const timer = setTimeout(() => {
      setShowFullScreen(true);
      nameAnim.enterRest();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleSwipeDown = (event: any) => {
    const { translationY, state } = event.nativeEvent;
    
    // Check if it's a downward swipe gesture (translationY > 50) and gesture is ending
    if (state === State.END && translationY > 50) {
      Keyboard.dismiss();
    }
  };

  const handleModalOverlayPress = (modalType: 'month' | 'day') => {
    Keyboard.dismiss();
    if (modalType === 'month') {
      setShowMonthModal(false);
    } else if (modalType === 'day') {
      setShowDayModal(false);
    }
  };

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev => {
      if (prev.includes(interest)) {
        return prev.filter(item => item !== interest);
      } else if (prev.length < 10) {
        return [...prev, interest];
      }
      return prev;
    });
  };

  const handleContinue = async () => {
    if (currentStep === 'name' && firstName.trim()) {
      // Animate out the name section and in the birthday section
      await nameAnim.exit();
      setCurrentStep('birthday');
      birthdayAnim.enter();
    } else if (currentStep === 'birthday' && selectedMonth && selectedDay) {
      // Animate out the birthday section and show results
      const zodiacData = getZodiacSign(selectedMonth, selectedDay, MONTHS);
      if (!zodiacData) return;

      setZodiacSign(zodiacData.signName);
      setZodiacResult(zodiacData);
      await birthdayAnim.exit();
      setCurrentStep('results');
      resultsAnim.enter();
    } else if (currentStep === 'results') {
      // Animate out the results section and show interests
      setCurrentStep('interests');
      interestsAnim.enter();
    } else if (currentStep === 'interests' && selectedInterests.length >= 3) {
      // Navigate to character screen with user data
      router.push({
        pathname: '/character',
        params: {
          zodiacSign,
          interests: JSON.stringify(selectedInterests),
          firstName
        }
      });
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
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

        <PanGestureHandler onHandlerStateChange={handleSwipeDown}>
          <View style={styles.content}>
            {/* Name Step */}
            {currentStep === 'name' && (
              <NameStep
                {...nameAnim}
                showFullScreen={showFullScreen}
                firstName={firstName}
                setFirstName={setFirstName}
                onContinue={handleContinue}
              />
            )}

            {/* Birthday Step */}
            {currentStep === 'birthday' && (
              <BirthdayStep
                {...birthdayAnim}
                selectedMonth={selectedMonth}
                selectedDay={selectedDay}
                showMonthModal={showMonthModal}
                showDayModal={showDayModal}
                setShowMonthModal={setShowMonthModal}
                setShowDayModal={setShowDayModal}
                setSelectedMonth={setSelectedMonth}
                setSelectedDay={setSelectedDay}
                onContinue={handleContinue}
                onModalOverlayPress={handleModalOverlayPress}
              />
            )}

            {/* Results Step */}
            {currentStep === 'results' && (
              <ResultsStep
                {...resultsAnim}
                zodiacResult={zodiacResult}
                onContinue={handleContinue}
              />
            )}

            {/* Interests Step */}
            {currentStep === 'interests' && (
              <InterestsStep
                {...interestsAnim}
                selectedInterests={selectedInterests}
                onToggleInterest={toggleInterest}
                onContinue={handleContinue}
              />
            )}
          </View>
        </PanGestureHandler>
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
  );
}
