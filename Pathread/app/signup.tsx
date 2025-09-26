import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, StatusBar, Platform, KeyboardAvoidingView, Animated, Modal, ScrollView, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { PanGestureHandler, State, GestureHandlerRootView } from 'react-native-gesture-handler';

export default function SignUpScreen() {
  const [showFullScreen, setShowFullScreen] = useState(false);
  const [currentStep, setCurrentStep] = useState('name'); // 'name', 'birthday', 'results', or 'interests'
  const [firstName, setFirstName] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [showMonthModal, setShowMonthModal] = useState(false);
  const [showDayModal, setShowDayModal] = useState(false);
  const [zodiacResult, setZodiacResult] = useState<any>(null);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  // Interests data
  const interests = [
    'Art & Design', 'Gaming', 'Hiking', 'Exercising', 'Music',
    'Photography', 'Cooking', 'Travel', 'Reading', 'Movies',
    'Sports', 'Dancing', 'Writing', 'Technology', 'Nature',
    'Fashion', 'Meditation', 'Gardening', 'Crafting', 'Astronomy',
    'History', 'Science', 'Languages', 'Volunteering', 'Collecting',
    'Theater', 'Comedy', 'Fitness', 'Yoga', 'Puzzles'
  ];

  // Month and day options
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());

  // Zodiac data
  const zodiacSigns = {
    'Aries': {
      emoji: '🔥',
      name: 'Flamebearer',
      traits: 'Bold, adventurous, energetic, pioneering.',
      archetype: 'The Hero who sparks journeys.',
      dateRange: { start: { month: 3, day: 21 }, end: { month: 4, day: 19 } }
    },
    'Taurus': {
      emoji: '🌿',
      name: 'Earthwarden',
      traits: 'Steadfast, patient, sensual, grounded.',
      archetype: 'The Guardian of comfort and stability.',
      dateRange: { start: { month: 4, day: 20 }, end: { month: 5, day: 20 } }
    },
    'Gemini': {
      emoji: '🌬',
      name: 'Twinweaver',
      traits: 'Curious, witty, adaptable, sociable.',
      archetype: 'The Trickster who thrives on duality.',
      dateRange: { start: { month: 5, day: 21 }, end: { month: 6, day: 20 } }
    },
    'Cancer': {
      emoji: '🌊',
      name: 'Tidekeeper',
      traits: 'Nurturing, emotional, intuitive, protective.',
      archetype: 'The Healer or Caretaker of stories.',
      dateRange: { start: { month: 6, day: 21 }, end: { month: 7, day: 22 } }
    },
    'Leo': {
      emoji: '☀️',
      name: 'Sunforged',
      traits: 'Confident, radiant, expressive, loyal.',
      archetype: 'The Performer who commands the stage.',
      dateRange: { start: { month: 7, day: 23 }, end: { month: 8, day: 22 } }
    },
    'Virgo': {
      emoji: '🌾',
      name: 'Quillwright',
      traits: 'Analytical, detail-oriented, practical, helpful.',
      archetype: 'The Scholar or Scribe who perfects the tale.',
      dateRange: { start: { month: 8, day: 23 }, end: { month: 9, day: 22 } }
    },
    'Libra': {
      emoji: '⚖️',
      name: 'Balanceseeker',
      traits: 'Harmonious, diplomatic, aesthetic, fair.',
      archetype: 'The Mediator who restores balance.',
      dateRange: { start: { month: 9, day: 23 }, end: { month: 10, day: 22 } }
    },
    'Scorpio': {
      emoji: '🦂',
      name: 'Veilbreaker',
      traits: 'Intense, transformative, passionate, mysterious.',
      archetype: 'The Rebel who uncovers hidden truths.',
      dateRange: { start: { month: 10, day: 23 }, end: { month: 11, day: 21 } }
    },
    'Sagittarius': {
      emoji: '🌌',
      name: 'Pathwanderer',
      traits: 'Adventurous, philosophical, optimistic, free-spirited.',
      archetype: 'The Explorer in search of wisdom.',
      dateRange: { start: { month: 11, day: 22 }, end: { month: 12, day: 21 } }
    },
    'Capricorn': {
      emoji: '🪨',
      name: 'Stonebound',
      traits: 'Disciplined, ambitious, responsible, determined.',
      archetype: 'The Builder who creates lasting legacies.',
      dateRange: { start: { month: 12, day: 22 }, end: { month: 1, day: 19 } }
    },
    'Aquarius': {
      emoji: '🌠',
      name: 'Starborn',
      traits: 'Visionary, unconventional, humanitarian, innovative.',
      archetype: 'The Dreamer who imagines new worlds.',
      dateRange: { start: { month: 1, day: 20 }, end: { month: 2, day: 18 } }
    },
    'Pisces': {
      emoji: '🌙',
      name: 'Dreamtide',
      traits: 'Compassionate, imaginative, spiritual, empathetic.',
      archetype: 'The Mystic who swims in stories and symbols.',
      dateRange: { start: { month: 2, day: 19 }, end: { month: 3, day: 20 } }
    }
  };

  // Function to determine zodiac sign
  const getZodiacSign = (month: string, day: string) => {
    const monthNum = months.indexOf(month) + 1;
    const dayNum = parseInt(day);
    
    for (const [signName, signData] of Object.entries(zodiacSigns)) {
      const { start, end } = signData.dateRange;
      
      // Handle Capricorn (spans across year)
      if (start.month === 12 && end.month === 1) {
        if ((monthNum === 12 && dayNum >= start.day) || (monthNum === 1 && dayNum <= end.day)) {
          return { signName, ...signData };
        }
      } else {
        // Regular signs
        if (monthNum === start.month && dayNum >= start.day) {
          return { signName, ...signData };
        }
        if (monthNum === end.month && dayNum <= end.day) {
          return { signName, ...signData };
        }
      }
    }
    
    return null;
  };
  
  // Animation values for name step
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

  // Animation values for birthday step
  const birthdayTitleOpacity = useRef(new Animated.Value(0)).current;
  const birthdayTitleScale = useRef(new Animated.Value(0.8)).current;
  const birthdayTitleTranslateY = useRef(new Animated.Value(20)).current;
  const birthdaySubtitleOpacity = useRef(new Animated.Value(0)).current;
  const birthdaySubtitleTranslateY = useRef(new Animated.Value(20)).current;
  const birthdayInputOpacity = useRef(new Animated.Value(0)).current;
  const birthdayInputTranslateY = useRef(new Animated.Value(30)).current;
  const birthdayButtonOpacity = useRef(new Animated.Value(0)).current;
  const birthdayButtonTranslateY = useRef(new Animated.Value(30)).current;

  // Animation values for results step
  const resultsYouAreOpacity = useRef(new Animated.Value(0)).current;
  const resultsYouAreTranslateY = useRef(new Animated.Value(20)).current;
  const resultsIconOpacity = useRef(new Animated.Value(0)).current;
  const resultsIconScale = useRef(new Animated.Value(0.5)).current;
  const resultsTitleOpacity = useRef(new Animated.Value(0)).current;
  const resultsTitleScale = useRef(new Animated.Value(0.8)).current;
  const resultsTitleTranslateY = useRef(new Animated.Value(20)).current;
  const resultsDescriptionOpacity = useRef(new Animated.Value(0)).current;
  const resultsDescriptionTranslateY = useRef(new Animated.Value(30)).current;
  const resultsButtonOpacity = useRef(new Animated.Value(0)).current;
  const resultsButtonTranslateY = useRef(new Animated.Value(30)).current;

  // Animation values for interests step
  const interestsTitleOpacity = useRef(new Animated.Value(0)).current;
  const interestsTitleScale = useRef(new Animated.Value(0.8)).current;
  const interestsTitleTranslateY = useRef(new Animated.Value(20)).current;
  const interestsSubtitleOpacity = useRef(new Animated.Value(0)).current;
  const interestsSubtitleTranslateY = useRef(new Animated.Value(20)).current;
  const interestsGridOpacity = useRef(new Animated.Value(0)).current;
  const interestsGridTranslateY = useRef(new Animated.Value(30)).current;
  const interestsButtonOpacity = useRef(new Animated.Value(0)).current;
  const interestsButtonTranslateY = useRef(new Animated.Value(30)).current;

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
    if (currentStep === 'name' && firstName.trim()) {
      // Animate out the name section and in the birthday section
      animateToBirthday();
    } else if (currentStep === 'birthday' && selectedMonth && selectedDay) {
      // Animate out the birthday section and show results
      animateToResults();
    } else if (currentStep === 'results') {
      // Animate out the results section and show interests
      animateToInterests();
    } else if (currentStep === 'interests' && selectedInterests.length >= 3) {
      // Navigate to main app or next screen
      console.log('User interests:', selectedInterests);
      router.push('/');
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

  const animateToBirthday = () => {
    // First, animate out the current content
    Animated.parallel([
      Animated.timing(titleOpacity, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(subtitleOpacity, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(inputOpacity, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(buttonOpacity, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // After exit animation completes, change step and animate in birthday content
      setCurrentStep('birthday');
      
      // Start birthday animations
      Animated.parallel([
        Animated.timing(birthdayTitleOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(birthdayTitleScale, {
          toValue: 1,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(birthdayTitleTranslateY, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();

      // After 1 second, show the rest of birthday content
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(birthdaySubtitleOpacity, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(birthdaySubtitleTranslateY, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(birthdayInputOpacity, {
            toValue: 1,
            duration: 600,
            delay: 200,
            useNativeDriver: true,
          }),
          Animated.timing(birthdayInputTranslateY, {
            toValue: 0,
            duration: 600,
            delay: 200,
            useNativeDriver: true,
          }),
          Animated.timing(birthdayButtonOpacity, {
            toValue: 1,
            duration: 600,
            delay: 400,
            useNativeDriver: true,
          }),
          Animated.timing(birthdayButtonTranslateY, {
            toValue: 0,
            duration: 600,
            delay: 400,
            useNativeDriver: true,
          }),
        ]).start();
      }, 1000);
    });
  };

  const animateToResults = () => {
    // Get zodiac sign first
    const zodiacSign = getZodiacSign(selectedMonth, selectedDay);
    if (!zodiacSign) return;

    // Set the zodiac result
    setZodiacResult(zodiacSign);

    // Animate out the birthday content
    Animated.parallel([
      Animated.timing(birthdayTitleOpacity, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(birthdaySubtitleOpacity, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(birthdayInputOpacity, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(birthdayButtonOpacity, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // After exit animation completes, change step and animate in results content
      setCurrentStep('results');
      
      // Start results animations
      Animated.sequence([
        // First, animate "YOU ARE A"
        Animated.parallel([
          Animated.timing(resultsYouAreOpacity, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(resultsYouAreTranslateY, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
        ]),
        // Then animate the icon
        Animated.parallel([
          Animated.timing(resultsIconOpacity, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.spring(resultsIconScale, {
            toValue: 1,
            tension: 50,
            friction: 8,
            useNativeDriver: true,
          }),
        ]),
        // Then animate the title
        Animated.parallel([
          Animated.timing(resultsTitleOpacity, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.spring(resultsTitleScale, {
            toValue: 1,
            tension: 50,
            friction: 8,
            useNativeDriver: true,
          }),
          Animated.timing(resultsTitleTranslateY, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
        ]),
        // Then animate the description
        Animated.parallel([
          Animated.timing(resultsDescriptionOpacity, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(resultsDescriptionTranslateY, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
        ]),
        // Finally animate the button
        Animated.parallel([
          Animated.timing(resultsButtonOpacity, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(resultsButtonTranslateY, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    });
  };

  const animateToInterests = () => {
    // Animate out the results content
    Animated.parallel([
      Animated.timing(resultsYouAreOpacity, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(resultsIconOpacity, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(resultsTitleOpacity, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(resultsDescriptionOpacity, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(resultsButtonOpacity, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // After exit animation completes, change step and animate in interests content
      setCurrentStep('interests');
      
      // Start interests animations
      Animated.sequence([
        // First, animate the title
        Animated.parallel([
          Animated.timing(interestsTitleOpacity, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.spring(interestsTitleScale, {
            toValue: 1,
            tension: 50,
            friction: 8,
            useNativeDriver: true,
          }),
          Animated.timing(interestsTitleTranslateY, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
        ]),
        // Then animate the subtitle
        Animated.parallel([
          Animated.timing(interestsSubtitleOpacity, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(interestsSubtitleTranslateY, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
        ]),
        // Then animate the grid
        Animated.parallel([
          Animated.timing(interestsGridOpacity, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(interestsGridTranslateY, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
        ]),
        // Finally animate the button
        Animated.parallel([
          Animated.timing(interestsButtonOpacity, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(interestsButtonTranslateY, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    });
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
          </>
        )}

        {/* Birthday Step */}
        {currentStep === 'birthday' && (
          <>
            <Animated.View 
              style={[
                styles.titleContainer,
                {
                  opacity: birthdayTitleOpacity,
                  transform: [
                    { translateY: birthdayTitleTranslateY },
                    { scale: birthdayTitleScale }
                  ]
                }
              ]}
            >
              <Text style={styles.birthdayQuestion}>When's your birthday?</Text>
            </Animated.View>

            <Animated.View 
              style={[
                styles.subtitleContainer,
                {
                  opacity: birthdaySubtitleOpacity,
                  transform: [{ translateY: birthdaySubtitleTranslateY }]
                }
              ]}
            >
              <Text style={styles.subtitle}>
                We'll use this to personalize your reading experience.
              </Text>
            </Animated.View>

            <Animated.View 
              style={[
                styles.formContainer,
                {
                  opacity: birthdayInputOpacity,
                  transform: [{ translateY: birthdayInputTranslateY }]
                }
              ]}
            >
              <View style={styles.inputRow}>
                <TouchableOpacity 
                  style={[styles.dropdownButton, styles.halfInput]}
                  onPress={() => setShowMonthModal(true)}
                >
                  <Text style={[styles.dropdownText, !selectedMonth && styles.placeholderText]}>
                    {selectedMonth || 'Month'}
                  </Text>
                  <Ionicons name="chevron-down" size={20} color="#7a7f85" />
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.dropdownButton, styles.halfInput]}
                  onPress={() => setShowDayModal(true)}
                >
                  <Text style={[styles.dropdownText, !selectedDay && styles.placeholderText]}>
                    {selectedDay || 'Day'}
                  </Text>
                  <Ionicons name="chevron-down" size={20} color="#7a7f85" />
                </TouchableOpacity>
              </View>
            </Animated.View>

            <Animated.View 
              style={[
                styles.buttonContainer,
                {
                  opacity: birthdayButtonOpacity,
                  transform: [{ translateY: birthdayButtonTranslateY }]
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

        {/* Results Step */}
        {currentStep === 'results' && zodiacResult && (
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
          </>
        )}

        {/* Interests Step */}
        {currentStep === 'interests' && (
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
                  {interests.map((interest) => (
                    <TouchableOpacity
                      key={interest}
                      style={[
                        styles.interestTag,
                        selectedInterests.includes(interest) && styles.selectedInterestTag
                      ]}
                      onPress={() => toggleInterest(interest)}
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
                onPress={handleContinue}
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
        )}
        </View>
      </PanGestureHandler>

      {/* Month Selection Modal */}
      <Modal
        visible={showMonthModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowMonthModal(false)}
      >
        <TouchableWithoutFeedback onPress={() => handleModalOverlayPress('month')}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Month</Text>
            <ScrollView 
              style={styles.modalScrollView}
              showsVerticalScrollIndicator={false}
              bounces={false}
            >
              {months.map((month) => (
                <TouchableOpacity
                  key={month}
                  style={[
                    styles.modalOption,
                    selectedMonth === month && styles.selectedOption
                  ]}
                  onPress={() => {
                    setSelectedMonth(month);
                    setShowMonthModal(false);
                  }}
                >
                  <Text style={[
                    styles.modalOptionText,
                    selectedMonth === month && styles.selectedOptionText
                  ]}>
                    {month}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.modalCancel}
              onPress={() => setShowMonthModal(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Day Selection Modal */}
      <Modal
        visible={showDayModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowDayModal(false)}
      >
        <TouchableWithoutFeedback onPress={() => handleModalOverlayPress('day')}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Day</Text>
            <ScrollView 
              style={styles.modalScrollView}
              showsVerticalScrollIndicator={false}
              bounces={false}
            >
              {days.map((day) => (
                <TouchableOpacity
                  key={day}
                  style={[
                    styles.modalOption,
                    selectedDay === day && styles.selectedOption
                  ]}
                  onPress={() => {
                    setSelectedDay(day);
                    setShowDayModal(false);
                  }}
                >
                  <Text style={[
                    styles.modalOptionText,
                    selectedDay === day && styles.selectedOptionText
                  ]}>
                    {day}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.modalCancel}
              onPress={() => setShowDayModal(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
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
    paddingTop: 20,
    paddingBottom: 20,
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
  birthdayQuestion: {
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
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  dropdownButton: {
    backgroundColor: 'rgba(15,15,18,0.8)',
    borderWidth: 1,
    borderColor: 'rgba(120,130,150,0.3)',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 56,
  },
  dropdownText: {
    color: '#ffffff',
    fontSize: 16,
  },
  placeholderText: {
    color: '#7a7f85',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'rgba(15,15,18,0.98)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: '100%',
    maxHeight: '60%',
    borderWidth: 1,
    borderColor: 'rgba(120,130,150,0.3)',
    borderBottomWidth: 0,
  },
  modalTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(120,130,150,0.2)',
  },
  modalScrollView: {
    maxHeight: 300,
  },
  modalOption: {
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(120,130,150,0.1)',
  },
  selectedOption: {
    backgroundColor: 'rgba(74, 144, 226, 0.2)',
  },
  modalOptionText: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
  selectedOptionText: {
    color: '#4A90E2',
    fontWeight: '600',
  },
  modalCancel: {
    marginTop: 10,
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(120,130,150,0.2)',
    borderRadius: 12,
  },
  modalCancelText: {
    color: '#9aa0a6',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
  // Results step styles
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
  resultsTitleContainer: {
    alignItems: 'center',
    marginBottom: 25,
  },
  resultsTitle: {
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
  // Interests step styles
  interestsTitleContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  interestsTitle: {
    color: '#ffffff',
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
  },
  interestsSubtitleContainer: {
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  interestsSubtitle: {
    color: '#9aa0a6',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 20,
  },
  interestsGridContainer: {
    width: '100%',
    flex: 1,
    marginBottom: 20,
  },
  interestsScrollView: {
    flex: 1,
  },
  interestsScrollContent: {
    paddingBottom: 10,
  },
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  interestTag: {
    backgroundColor: 'rgba(15,15,18,0.8)',
    borderWidth: 1,
    borderColor: 'rgba(120,130,150,0.3)',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
    minWidth: '30%',
    alignItems: 'center',
    marginBottom: 8,
  },
  selectedInterestTag: {
    backgroundColor: '#4A90E2',
    borderWidth: 0,
    overflow: 'hidden',
  },
  interestText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
  },
  selectedInterestText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonContainer: {
    width: '100%',
    paddingTop: 10,
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
