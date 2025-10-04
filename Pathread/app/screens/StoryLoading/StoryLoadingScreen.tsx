import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StatusBar, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { openaiService, StoryGenerationParams } from '../../../services/openaiService';

const { width, height } = Dimensions.get('window');

export default function StoryLoadingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    genre?: string;
    length?: string;
    tone?: string;
    perspective?: string;
    difficulty?: string;
    storyId?: string;
  }>();

  const [isGenerating, setIsGenerating] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textTranslateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    // Initial fade in animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Text animation after initial load
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(textTranslateY, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();
    }, 400);

    // Continuous rotation animation for the icon
    const rotateAnimation = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    );

    // Continuous pulse animation
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    rotateAnimation.start();
    pulseAnimation.start();

    // Generate the story
    generateStory();

    return () => {
      rotateAnimation.stop();
      pulseAnimation.stop();
    };
  }, []);

  const generateStory = async () => {
    try {
      setIsGenerating(true);
      setError(null);

      console.log('Starting story generation with params:', params);

      // Check if OpenAI is configured
      if (!openaiService.isConfigured()) {
        throw new Error('OpenAI API key not configured. Please set your API key in the environment variables.');
      }

      // Prepare story generation parameters
      const storyParams: StoryGenerationParams = {
        genre: params.genre,
        length: params.length,
        tone: params.tone,
        perspective: params.perspective,
        difficulty: params.difficulty,
        storyId: params.storyId,
        isFirstGeneration: true,
      };

      console.log('Story params prepared:', storyParams);

      // Generate the story
      const story = await openaiService.generateStory(storyParams);
      
      console.log('Story generated successfully:', story);
      
      // Simulate a minimum loading time for better UX
      const minLoadingTime = 2000; // 2 seconds
      const startTime = Date.now();
      
      await new Promise(resolve => setTimeout(resolve, minLoadingTime));
      
      // Navigate to story reader with the generated story
      console.log('Generated story:', story);
      
      // Navigate to story reader
      setTimeout(() => {
        router.replace({
          pathname: '/story-reader' as any,
          params: {
            storyId: 'new', // Will be replaced with actual story ID in reader
            genre: params.genre,
            length: params.length,
            tone: params.tone,
            perspective: params.perspective,
            difficulty: params.difficulty,
          },
        });
      }, 1000);
      
    } catch (err) {
      console.error('Story generation failed:', err);
      console.error('Error details:', {
        message: err instanceof Error ? err.message : 'Unknown error',
        stack: err instanceof Error ? err.stack : undefined,
        params: params,
      });
      
      setError(err instanceof Error ? err.message : 'Failed to generate story');
      setIsGenerating(false);
      
      // Navigate back to home after showing error
      setTimeout(() => {
        router.replace('/home' as any);
      }, 3000);
    }
  };

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      {/* Background gradient */}
      <LinearGradient
        colors={["rgba(78, 84, 200, 0.25)", "rgba(143, 148, 251, 0.10)", 'rgba(0,0,0,0.8)']}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={styles.background}
      />

      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          }
        ]}
      >
        {/* Main loading icon */}
        <Animated.View
          style={[
            styles.iconContainer,
            {
              transform: [
                { rotate: rotateInterpolate },
                { scale: pulseAnim }
              ],
            }
          ]}
        >
          <Ionicons name="book" size={80} color="#ffffff" />
        </Animated.View>

        {/* Loading text */}
        <Animated.View
          style={[
            styles.textContainer,
            {
              opacity: textOpacity,
              transform: [{ translateY: textTranslateY }],
            }
          ]}
        >
          {error ? (
            <>
              <Text style={styles.title}>Oops!</Text>
              <Text style={styles.subtitle}>
                {error}
              </Text>
              <Text style={styles.errorSubtitle}>
                Redirecting you back to home...
              </Text>
            </>
          ) : (
            <>
              <Text style={styles.title}>Crafting Your Story</Text>
              <Text style={styles.subtitle}>
                Our AI is weaving together the perfect narrative for you...
              </Text>
            </>
          )}
        </Animated.View>

        {/* Loading dots animation - only show when not in error state */}
        {!error && (
          <Animated.View style={styles.dotsContainer}>
            <Animated.View style={[styles.dot, { opacity: pulseAnim }]} />
            <Animated.View style={[styles.dot, { opacity: pulseAnim }]} />
            <Animated.View style={[styles.dot, { opacity: pulseAnim }]} />
          </Animated.View>
        )}
      </Animated.View>
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  background: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  content: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    paddingHorizontal: 40,
  },
  iconContainer: {
    marginBottom: 40,
    padding: 20,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  textContainer: {
    alignItems: 'center' as const,
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: '#ffffff',
    textAlign: 'center' as const,
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center' as const,
    lineHeight: 24,
    maxWidth: 280,
  },
  errorSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center' as const,
    lineHeight: 20,
    maxWidth: 280,
    marginTop: 8,
  },
  dotsContainer: {
    flexDirection: 'row' as const,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ffffff',
    marginHorizontal: 4,
  },
};
