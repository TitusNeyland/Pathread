import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StatusBar, Platform, KeyboardAvoidingView, ScrollView, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { PanGestureHandler, State, GestureHandlerRootView } from 'react-native-gesture-handler';
import { characterStyles as styles } from './styles/character.styles';
import { generateCharacterBio, CharacterBio } from './utils/bioGenerator';

export default function CharacterScreen() {
  const { zodiacSign, interests, firstName } = useLocalSearchParams<{
    zodiacSign: string;
    interests: string;
    firstName: string;
  }>();
  const [characterBio, setCharacterBio] = useState<CharacterBio | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Animation values
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleTranslateY = useRef(new Animated.Value(30)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const subtitleTranslateY = useRef(new Animated.Value(20)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const cardScale = useRef(new Animated.Value(0.8)).current;
  const cardTranslateY = useRef(new Animated.Value(40)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;
  const buttonTranslateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    // Generate AI-powered character bio
    const generateBio = async () => {
      if (!zodiacSign || !interests || !firstName) return;
      
      setIsLoading(true);
      
      try {
        // Parse interests from JSON string
        const interestsArray = JSON.parse(interests);
        
        // Generate AI-powered bio using the user's actual data
        const bio = await generateCharacterBio(zodiacSign, interestsArray, firstName);
        setCharacterBio(bio);
      } catch (error) {
        console.error('Error generating character bio:', error);
        // Fallback will be handled by the bio generator
        const interestsArray = JSON.parse(interests);
        const bio = await generateCharacterBio(zodiacSign, interestsArray, firstName);
        setCharacterBio(bio);
      } finally {
        setIsLoading(false);
      }
    };

    generateBio();
  }, [zodiacSign, interests, firstName]);

  // Animation effect when character bio loads
  useEffect(() => {
    if (characterBio && !isLoading) {
      // Reset all animations
      titleOpacity.setValue(0);
      titleTranslateY.setValue(30);
      subtitleOpacity.setValue(0);
      subtitleTranslateY.setValue(20);
      cardOpacity.setValue(0);
      cardScale.setValue(0.8);
      cardTranslateY.setValue(40);
      buttonOpacity.setValue(0);
      buttonTranslateY.setValue(20);

      // Animate elements in sequence
      Animated.sequence([
        // Title animation
        Animated.parallel([
          Animated.timing(titleOpacity, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(titleTranslateY, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
        ]),
        // Subtitle animation
        Animated.parallel([
          Animated.timing(subtitleOpacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(subtitleTranslateY, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
        // Card animation
        Animated.parallel([
          Animated.timing(cardOpacity, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(cardScale, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(cardTranslateY, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
        // Button animation
        Animated.parallel([
          Animated.timing(buttonOpacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(buttonTranslateY, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    }
  }, [characterBio, isLoading]);

  const handleSwipeDown = (event: any) => {
    const { translationY, state } = event.nativeEvent;
    
    if (state === State.END && translationY > 50) {
      // Could add keyboard dismissal if needed
    }
  };

  const handleBeginJourney = () => {
    // Navigate to the home screen
    router.push('/home');
  };

  if (isLoading) {
    return (
      <GestureHandlerRootView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#000000" />
        
        {/* Background */}
        <LinearGradient
          colors={["rgba(78, 84, 200, 0.25)", "rgba(143, 148, 251, 0.10)", 'rgba(0,0,0,0.6)']}
          start={{ x: 0.1, y: 0 }}
          end={{ x: 0.9, y: 1 }}
          style={styles.background}
        />

        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Crafting your character...</Text>
          <Text style={styles.loadingSubtext}>Our AI is weaving your unique story</Text>
        </View>
      </GestureHandlerRootView>
    );
  }

  if (!characterBio) {
    return null;
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      {/* Background */}
      <LinearGradient
        colors={["rgba(78, 84, 200, 0.25)", "rgba(143, 148, 251, 0.10)", 'rgba(0,0,0,0.6)']}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={styles.background}
      />

      <PanGestureHandler onHandlerStateChange={handleSwipeDown}>
        <ScrollView 
          style={{ flex: 1 }}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Title */}
          <Animated.View
            style={{
              opacity: titleOpacity,
              transform: [{ translateY: titleTranslateY }],
            }}
          >
            <Text style={styles.title}>Meet your character</Text>
          </Animated.View>

          {/* Subtitle */}
          <Animated.View
            style={{
              opacity: subtitleOpacity,
              transform: [{ translateY: subtitleTranslateY }],
            }}
          >
            <Text style={styles.subtitle}>Here's who you are in the world of Pathread</Text>
          </Animated.View>

          {/* Character Card */}
          <Animated.View 
            style={[
              styles.characterCard,
              {
                opacity: cardOpacity,
                transform: [
                  { scale: cardScale },
                  { translateY: cardTranslateY }
                ],
              }
            ]}
          >
            {/* Icon */}
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>🌙</Text>
              <View style={styles.iconDashes}>
                <View style={styles.dash} />
                <View style={styles.dash} />
                <View style={styles.dash} />
                <View style={styles.dash} />
              </View>
            </View>

            {/* Character Name */}
            <Text style={styles.characterName}>{characterBio.name}</Text>
            
            {/* Character Title */}
            <Text style={styles.characterTitle}>{characterBio.title}</Text>

            {/* Tags */}
            <View style={styles.tagsContainer}>
              {characterBio.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>

            {/* Description */}
            <Text style={styles.description}>{characterBio.description}</Text>

            {/* Backstory */}
            <Text style={styles.backstory}>{characterBio.backstory}</Text>

            {/* Begin Journey Button */}
            <Animated.View 
              style={[
                styles.buttonContainer,
                {
                  opacity: buttonOpacity,
                  transform: [{ translateY: buttonTranslateY }],
                }
              ]}
            >
              <TouchableOpacity 
                activeOpacity={0.95} 
                style={styles.button}
                onPress={handleBeginJourney}
              >
                <LinearGradient
                  colors={["#4A90E2", "#7B68EE"]}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={styles.buttonGradient}
                >
                  <Text style={styles.buttonText}>Begin your journey</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>
        </ScrollView>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
}
