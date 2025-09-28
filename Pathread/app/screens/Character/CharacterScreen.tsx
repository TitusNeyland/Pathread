import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StatusBar, Platform, KeyboardAvoidingView, ScrollView } from 'react-native';
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

  useEffect(() => {
    // Simulate AI generation time
    const generateBio = async () => {
      if (!zodiacSign || !interests || !firstName) return;
      
      setIsLoading(true);
      
      // Parse interests from JSON string
      const interestsArray = JSON.parse(interests);
      
      // Simulate processing time for AI generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const bio = generateCharacterBio(zodiacSign, interestsArray, firstName);
      setCharacterBio(bio);
      setIsLoading(false);
    };

    generateBio();
  }, [zodiacSign, interests, firstName]);

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
          <Text style={styles.title}>Meet your character</Text>
          <Text style={styles.subtitle}>Here's who you are in the world of Pathread</Text>

          {/* Character Card */}
          <View style={styles.characterCard}>
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
            <View style={styles.buttonContainer}>
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
            </View>
          </View>
        </ScrollView>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
}
