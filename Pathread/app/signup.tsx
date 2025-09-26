import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, StatusBar, Platform, KeyboardAvoidingView, Animated, Modal, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function SignUpScreen() {
  const [showFullScreen, setShowFullScreen] = useState(false);
  const [currentStep, setCurrentStep] = useState('name'); // 'name' or 'birthday'
  const [firstName, setFirstName] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [showMonthModal, setShowMonthModal] = useState(false);
  const [showDayModal, setShowDayModal] = useState(false);

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
      // Get zodiac sign and navigate to results
      const zodiacSign = getZodiacSign(selectedMonth, selectedDay);
      if (zodiacSign) {
        // Navigate to results screen with user data
        router.push({
          pathname: '/results',
          params: {
            firstName: firstName,
            zodiacData: JSON.stringify(zodiacSign)
          }
        });
      }
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
      </View>

      {/* Month Selection Modal */}
      <Modal
        visible={showMonthModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowMonthModal(false)}
      >
        <View style={styles.modalOverlay}>
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
        </View>
      </Modal>

      {/* Day Selection Modal */}
      <Modal
        visible={showDayModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowDayModal(false)}
      >
        <View style={styles.modalOverlay}>
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
        </View>
      </Modal>
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
