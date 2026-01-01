import React, { useEffect, useMemo, useState, useRef, useCallback } from 'react';
import { 
  View, 
  Text, 
  ActivityIndicator, 
  TouchableOpacity, 
  ImageBackground, 
  StatusBar,
  Dimensions,
  Animated,
  ScrollView
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
// import { BlurView } from 'expo-blur'; // Removed due to compatibility issues

const { width, height } = Dimensions.get('window');

type GeneratePayload = {
  hookId: string;
  hookDescription?: string;
  genre?: string;
  length?: string;
  tone?: string;
  perspective?: string;
  difficulty?: string;
};

type StoryChoice = {
  id: string;
  text: string;
  icon: keyof typeof Ionicons.glyphMap;
  gradient: string[];
};

async function generateStory(apiBaseUrl: string, payload: GeneratePayload): Promise<string> {
  const response = await fetch(`${apiBaseUrl}/generateStory`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'Failed to generate story');
  }
  const data = await response.json();
  return data.story as string;
}

export default function StoryReaderScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<GeneratePayload>();
  const [story, setStory] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentChapter, setCurrentChapter] = useState<number>(3);
  const [progress, setProgress] = useState<number>(52);
  const [chapterTitle, setChapterTitle] = useState<string>('THE CASTLE GATES');
  const [fadeAnim] = useState(new Animated.Value(0));
  const [storyHistory, setStoryHistory] = useState<string[]>([]);
  const [currentChoices, setCurrentChoices] = useState<StoryChoice[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [storyKey, setStoryKey] = useState<number>(0);
  const [choicesGenerated, setChoicesGenerated] = useState<boolean>(false);
  const [hasInitialized, setHasInitialized] = useState<boolean>(false);
  const [showChoices, setShowChoices] = useState<boolean>(false);
  const [choicesOpacity] = useState(new Animated.Value(0));
  const [choicesTranslateY] = useState(new Animated.Value(200));
  const wasAtBottom = useRef<boolean>(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const apiBaseUrl = useMemo(() => 'https://api-tbx2d52hwq-uc.a.run.app', []);

  // Default story choices - these will be updated based on story context
  const defaultChoices: StoryChoice[] = [
    {
      id: '1',
      text: 'Greet them politely',
      icon: 'hand-left-outline',
      gradient: ['#4A90E2', '#7B68EE']
    },
    {
      id: '2', 
      text: 'Attempt to deceive them',
      icon: 'eye-off-outline',
      gradient: ['#20B2AA', '#4169E1']
    },
    {
      id: '3',
      text: 'Charge forward recklessly',
      icon: 'flash-outline',
      gradient: ['#8A2BE2', '#191970']
    }
  ];

  useEffect(() => {
    // Only run once when component mounts
    if (hasInitialized) return;
    
    let isMounted = true;
    let timeoutId: ReturnType<typeof setTimeout>;
    
    (async () => {
      try {
        if (!apiBaseUrl) throw new Error('Missing EXPO_PUBLIC_API_BASE_URL');
        if (!params.hookId) throw new Error('Missing selected story');
        
        setHasInitialized(true); // Mark as initialized immediately
        
        const text = await generateStory(apiBaseUrl, params);
        if (isMounted) {
          setStory(text);
          setStoryHistory([text]);
          setStoryKey(0); // Reset story key
          setChoicesGenerated(false); // Reset choices generated flag
          
          // Start with default choices immediately
          setCurrentChoices(defaultChoices);
          
          // Check if story is short enough to show choices immediately
          setTimeout(() => {
            if (text.length < 500) {
              setShowChoices(true);
              wasAtBottom.current = true;
              choicesTranslateY.setValue(200);
              choicesOpacity.setValue(0);
              Animated.parallel([
                Animated.timing(choicesTranslateY, {
                  toValue: 0,
                  duration: 300,
                  useNativeDriver: true,
                }),
                Animated.timing(choicesOpacity, {
                  toValue: 1,
                  duration: 300,
                  useNativeDriver: true,
                }),
              ]).start();
            }
          }, 200);
          
          // Generate AI choices in the background (non-blocking)
          timeoutId = setTimeout(async () => {
            if (!isMounted || choicesGenerated) return;
            
            try {
              let firstName = 'You';
              if (params.hookDescription) {
                const nameMatch = params.hookDescription.match(/^([A-Za-z]+)/);
                if (nameMatch) {
                  firstName = nameMatch[1];
                }
              }

              console.log('Attempting to generate choices for:', { 
                storyContext: text.substring(0, 100) + '...', 
                genre: params.genre, 
                firstName,
                apiBaseUrl 
              });

              const choicesResponse = await fetch(`${apiBaseUrl}/generateChoices`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  storyContext: text,
                  genre: params.genre,
                  firstName: firstName
                }),
              });

              console.log('Choices response status:', choicesResponse.status);
              console.log('Choices response ok:', choicesResponse.ok);

              if (choicesResponse.ok && isMounted && !choicesGenerated) {
                const choicesData = await choicesResponse.json();
                console.log('Choices data received:', choicesData);
                
                try {
                  // Extract JSON from markdown code blocks if present
                  let jsonString = choicesData.choices;
                  const jsonMatch = jsonString.match(/```json\s*([\s\S]*?)\s*```/);
                  if (jsonMatch) {
                    jsonString = jsonMatch[1];
                  }
                  
                  const parsedChoices = JSON.parse(jsonString);
                  console.log('Parsed choices:', parsedChoices);
                  
                  if (parsedChoices.choices && Array.isArray(parsedChoices.choices) && isMounted && !choicesGenerated) {
                    setCurrentChoices(parsedChoices.choices);
                    setChoicesGenerated(true);
                    console.log('Successfully set AI choices');
                  }
                } catch (parseError) {
                  console.error('Error parsing initial choices:', parseError);
                  console.error('Raw choices data:', choicesData);
                }
              } else if (!choicesResponse.ok) {
                const errorText = await choicesResponse.text();
                console.error('Failed to generate initial AI choices:', choicesResponse.status, errorText);
              }
            } catch (error) {
              console.error('Error generating initial choices:', error);
              console.error('Error details:', (error as Error).message, (error as Error).stack);
            }
          }, 500); // Small delay to ensure UI is rendered first
        }
      } catch (e: any) {
        if (isMounted) setError(e?.message || 'Something went wrong');
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    
    return () => {
      isMounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []); // Empty dependency array - only run once on mount

  useEffect(() => {
    if (!loading && !error) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
    }
  }, [loading, error, fadeAnim]);

  // Reset function for when user navigates back to this screen
  const resetStory = useCallback(() => {
    setHasInitialized(false);
    setStory('');
    setStoryHistory([]);
    setCurrentChoices([]);
    setChoicesGenerated(false);
    setStoryKey(0);
    setError('');
    setLoading(true);
  }, []);

  // Note: Focus listener removed as it was causing issues with router.addListener

  const handleChoicePress = async (choiceId: string) => {
    if (isGenerating) return;
    
    setIsGenerating(true);
    const selectedChoice = currentChoices.find(choice => choice.id === choiceId);
    
    try {
      // Get user's first name
      let firstName = 'You';
      if (params.hookDescription) {
        const nameMatch = params.hookDescription.match(/^([A-Za-z]+)/);
        if (nameMatch) {
          firstName = nameMatch[1];
        }
      }

      // Call AI to continue the story and generate choices in parallel
      const [storyResponse, choicesResponse] = await Promise.all([
        fetch(`${apiBaseUrl}/continueStory`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            storyContext: story,
            choice: selectedChoice?.text || '',
            genre: params.genre,
            firstName: firstName
          }),
        }),
        // Pre-generate choices based on current story context
        fetch(`${apiBaseUrl}/generateChoices`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            storyContext: story,
            genre: params.genre,
            firstName: firstName
          }),
        })
      ]);

      if (!storyResponse.ok) {
        throw new Error('Failed to continue story');
      }

      const storyData = await storyResponse.json();
      const storyContinuation = storyData.story || `${firstName} made their choice and the story continued...`;
      
      // Format the user's choice display
      const choiceDisplay = `>> ${firstName} ${selectedChoice?.text.toLowerCase() || 'made their choice'}`;
      
      // Update story with choice display followed by story continuation
      const newStoryText = `${story}\n\n${choiceDisplay}\n\n${storyContinuation}`;
      
      setStory(newStoryText);
      setStoryHistory(prev => [...prev, choiceDisplay, storyContinuation]);
      setStoryKey(prev => prev + 1); // Force re-render with new key
      setChoicesGenerated(false); // Reset choices generated flag for new choices
      
      // Scroll to bottom to show the new story continuation and reveal choices
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
        setShowChoices(true);
        wasAtBottom.current = true;
        choicesTranslateY.setValue(200);
        choicesOpacity.setValue(0);
        Animated.parallel([
          Animated.timing(choicesTranslateY, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(choicesOpacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();
      }, 100);
      
      // Update progress
      setProgress(prev => Math.min(prev + 8, 100));
      
      // Update chapter title based on story progression
      if (progress > 80) {
        setChapterTitle('THE FINAL CONFRONTATION');
        setCurrentChapter(4);
      } else if (progress > 60) {
        setChapterTitle('DEEP IN THE CASTLE');
        setCurrentChapter(3);
      }
      
      // Handle choices response
      if (choicesResponse.ok) {
        const choicesData = await choicesResponse.json();
        console.log('Choice selection - choices data received:', choicesData);
        
        try {
          // Extract JSON from markdown code blocks if present
          let jsonString = choicesData.choices;
          const jsonMatch = jsonString.match(/```json\s*([\s\S]*?)\s*```/);
          if (jsonMatch) {
            jsonString = jsonMatch[1];
          }
          
          const parsedChoices = JSON.parse(jsonString);
          console.log('Choice selection - parsed choices:', parsedChoices);
          
          if (parsedChoices.choices && Array.isArray(parsedChoices.choices)) {
            setCurrentChoices(parsedChoices.choices);
            setChoicesGenerated(true);
            console.log('Successfully updated choices after selection');
          } else {
            console.error('Invalid choices format from AI:', parsedChoices);
            // Keep current choices if AI fails
          }
        } catch (parseError) {
          console.error('Error parsing choices:', parseError);
          console.error('Raw choices data:', choicesData);
          // Keep current choices if parsing fails
        }
      } else {
        const errorText = await choicesResponse.text();
        console.error('Failed to generate AI choices:', choicesResponse.status, errorText);
        // Keep current choices if API fails
      }
      
    } catch (error) {
      console.error('Error handling choice:', error);
      // Show error to user but don't fall back to hardcoded choices
      setError('Failed to continue story. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };



  const getBackgroundImage = () => {
    // Use different background images based on genre or story type
    const genre = params.genre || 'fantasy';
    switch (genre) {
      case 'fantasy':
        return require('../assets/images/story-cards/fantasy.png');
      case 'horror':
        return require('../assets/images/story-cards/mystical.png');
      case 'romance':
        return require('../assets/images/story-cards/lovestory.png');
      default:
        return require('../assets/images/story-cards/story1.png');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7c3aed" />
        <Text style={styles.loadingText}>Spinning words...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Blurred Background Image */}
      <ImageBackground
        source={getBackgroundImage()}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {/* Simulate blur effect with multiple gradient overlays */}
        <LinearGradient
          colors={['rgba(0,0,0,0.4)', 'rgba(0,0,0,0.6)', 'rgba(0,0,0,0.8)']}
          style={styles.gradientOverlay}
        />
        <LinearGradient
          colors={['rgba(0,0,0,0.2)', 'transparent', 'rgba(0,0,0,0.3)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientOverlay2}
        />
      </ImageBackground>

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Header Navigation - Fixed at top */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuButton}>
            <Ionicons name="ellipsis-vertical" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Full Screen Scrollable Story Content */}
        <ScrollView 
          ref={scrollViewRef}
          key={`scroll-${storyKey}`}
          style={styles.storyScrollView} 
          contentContainerStyle={styles.storyScrollContent}
          showsVerticalScrollIndicator={true}
          scrollEventThrottle={16}
          onScroll={(event) => {
            const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
            const paddingToBottom = 100;
            const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
            const shouldShow = isCloseToBottom || contentSize.height <= layoutMeasurement.height;
            
            // Detect when user crosses the threshold (reaches bottom or scrolls away)
            const justReachedBottom = shouldShow && !wasAtBottom.current;
            const justScrolledAway = !shouldShow && wasAtBottom.current;
            
            if (shouldShow !== showChoices) {
              setShowChoices(shouldShow);
            }
            
            // Animate every time user crosses the threshold (reaches bottom or scrolls away)
            if (justReachedBottom || justScrolledAway) {
              wasAtBottom.current = shouldShow;
              
              if (justReachedBottom) {
                // Slide up from bottom and fade in
                choicesTranslateY.setValue(200);
                choicesOpacity.setValue(0);
                Animated.parallel([
                  Animated.timing(choicesTranslateY, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                  }),
                  Animated.timing(choicesOpacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                  }),
                ]).start();
              } else if (justScrolledAway) {
                // Slide down and fade out
                Animated.parallel([
                  Animated.timing(choicesTranslateY, {
                    toValue: 200,
                    duration: 300,
                    useNativeDriver: true,
                  }),
                  Animated.timing(choicesOpacity, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                  }),
                ]).start();
              }
            }
          }}
          onContentSizeChange={(contentWidth, contentHeight) => {
            // Show choices if content is short (less than 500px, meaning it fits on screen)
            if (contentHeight < 500 && !showChoices) {
              setShowChoices(true);
              wasAtBottom.current = true;
              choicesTranslateY.setValue(200);
              choicesOpacity.setValue(0);
              Animated.parallel([
                Animated.timing(choicesTranslateY, {
                  toValue: 0,
                  duration: 300,
                  useNativeDriver: true,
                }),
                Animated.timing(choicesOpacity, {
                  toValue: 1,
                  duration: 300,
                  useNativeDriver: true,
                }),
              ]).start();
            }
          }}
          onLayout={(event) => {
            // Check if content fits in viewport on initial layout
            const { height: viewportHeight } = event.nativeEvent.layout;
            setTimeout(() => {
              scrollViewRef.current?.scrollTo({ y: 0, animated: false });
            }, 50);
          }}
        >
          {/* Chapter Title */}
          <View style={styles.chapterContainer}>
            <Text style={styles.chapterTitle}>
              CHAPTER {currentChapter}
            </Text>
            <Text style={styles.chapterSubtitle}>
              {chapterTitle}
            </Text>
          </View>

          {/* Story Text */}
          <Text key={`text-${storyKey}`} style={styles.storyText}>
            {story || 'The castle guards beckon you closer. How do you approach them?'}
          </Text>

          {/* Spacer for dialogue options */}
          <View style={styles.bottomSpacer} />
        </ScrollView>

        {/* Bottom Section - Choices and Progress - Fixed at bottom, shown when scrolled down */}
        {showChoices && (
          <Animated.View style={[
            styles.bottomSection, 
            { 
              opacity: choicesOpacity,
              transform: [{ translateY: choicesTranslateY }]
            }
          ]}>
            {/* Choice Buttons */}
            <View style={styles.choicesContainer}>
              {!isGenerating && currentChoices.map((choice, index) => (
                <TouchableOpacity
                  key={choice.id}
                  style={styles.choiceButton}
                  onPress={() => handleChoicePress(choice.id)}
                  activeOpacity={0.8}
                >
                  <View style={styles.choiceContent}>
                    <Ionicons name={choice.icon} size={20} color="white" />
                    <Text style={styles.choiceText}>{choice.text}</Text>
                  </View>
                </TouchableOpacity>
              ))}
              
            {isGenerating && (
              <View style={styles.generatingContainer}>
                <ActivityIndicator size="small" color="#7c3aed" />
                <Text style={styles.generatingText}>Continuing your story...</Text>
              </View>
            )}
            </View>

            {/* Progress Bar */}
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <LinearGradient
                  colors={['#8A2BE2', '#4169E1']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.progressFill, { width: `${progress}%` }]}
                />
              </View>
              <Text style={styles.progressText}>{progress}%</Text>
            </View>
          </Animated.View>
        )}
      </Animated.View>
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#0b0b14',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0b0b14',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  loadingText: {
    color: '#c7c7d4',
    marginTop: 12,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#0b0b14',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingHorizontal: 24,
  },
  errorText: {
    color: '#ff9aa2',
    fontSize: 16,
    textAlign: 'center' as const,
  },
  backButton: {
    marginTop: 16,
  },
  backButtonText: {
    color: '#7c3aed',
    fontSize: 16,
  },
  backgroundImage: {
    position: 'absolute' as const,
    width: width,
    height: height,
  },
  gradientOverlay: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gradientOverlay2: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  content: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: 10,
    zIndex: 10,
  },
  menuButton: {
    padding: 8,
  },
  storyScrollView: {
    flex: 1,
  },
  storyScrollContent: {
    paddingBottom: 250, // Space for dialogue options
    paddingHorizontal: 10,
  },
  chapterContainer: {
    alignItems: 'center' as const,
    marginBottom: 30,
    marginTop: 10,
  },
  chapterTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700' as const,
    textAlign: 'center' as const,
    marginBottom: 4,
  },
  chapterSubtitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600' as const,
    textAlign: 'center' as const,
  },
  storyText: {
    color: 'white',
    fontSize: 18,
    lineHeight: 28,
    textAlign: 'left' as const,
    fontWeight: '500' as const,
    paddingVertical: 20,
    includeFontPadding: false,
  },
  bottomSpacer: {
    height: 20,
  },
  bottomSection: {
    position: 'absolute' as const,
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 10,
    backgroundColor: 'rgba(11, 11, 20, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(124, 58, 237, 0.3)',
  },
  choicesContainer: {
    marginBottom: 15,
  },
  choiceButton: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: '#7c3aed',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  choiceContent: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'flex-start' as const,
  },
  choiceText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600' as const,
    marginLeft: 12,
    flex: 1,
  },
  progressContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    paddingHorizontal: 10,
    marginTop: 10,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    marginRight: 12,
  },
  progressFill: {
    flex: 1,
    borderRadius: 2,
  },
  progressText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600' as const,
  },
  generatingContainer: {
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingVertical: 20,
  },
  generatingText: {
    color: '#c7c7d4',
    fontSize: 16,
    marginTop: 8,
  },
};

