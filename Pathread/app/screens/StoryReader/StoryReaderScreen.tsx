import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  StatusBar, 
  Animated, 
  Alert,
  ActivityIndicator 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { openaiService } from '../../../services/openaiService';
import { storyStateService, StoryState } from '../../../services/storyStateService';

export default function StoryReaderScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    storyId?: string;
    genre?: string;
    length?: string;
    tone?: string;
    perspective?: string;
    difficulty?: string;
  }>();

  const [story, setStory] = useState<StoryState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const choiceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    initializeStory();
    
    // Animate in
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const initializeStory = async () => {
    try {
      setIsLoading(true);

      if (params.storyId) {
        // Load existing story
        const existingStory = storyStateService.getStory(params.storyId);
        if (existingStory) {
          setStory(existingStory);
          setIsLoading(false);
          return;
        }
      }

      // Create new story
      const storyParams = {
        genre: params.genre,
        length: params.length,
        tone: params.tone,
        perspective: params.perspective,
        difficulty: params.difficulty,
        storyId: params.storyId,
        isFirstGeneration: true,
      };

      const newStory = storyStateService.createNewStory(storyParams);
      setStory(newStory);

      // Generate initial story content
      const response = await openaiService.generateStory(storyParams);
      const updatedStory = storyStateService.updateStoryWithResponse(newStory.id, response);
      
      if (updatedStory) {
        setStory(updatedStory);
        animateChoices();
      }
    } catch (error) {
      console.error('Failed to initialize story:', error);
      Alert.alert('Error', 'Failed to start the story. Please try again.');
      router.back();
    } finally {
      setIsLoading(false);
    }
  };

  const handleChoiceSelect = async (choice: string) => {
    if (!story || isLoading) return;

    setSelectedChoice(choice);
    setIsLoading(true);

    try {
      // Add user action to story
      storyStateService.continueStoryWithAction(story.id, choice);

      // Get continuation parameters
      const continuationParams = storyStateService.getStoryForContinuation(story.id);
      if (!continuationParams) {
        throw new Error('Failed to get story continuation parameters');
      }

      continuationParams.userAction = choice;

      // Generate story continuation
      const response = await openaiService.continueStory(continuationParams);
      const updatedStory = storyStateService.updateStoryWithResponse(story.id, response);

      if (updatedStory) {
        setStory(updatedStory);
        setSelectedChoice(null);
        animateChoices();
      }
    } catch (error) {
      console.error('Failed to continue story:', error);
      Alert.alert('Error', 'Failed to continue the story. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const animateChoices = () => {
    choiceAnim.setValue(0);
    Animated.timing(choiceAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  };

  const handleBack = () => {
    router.back();
  };

  const handleSave = () => {
    if (story) {
      const storyData = storyStateService.exportStory(story.id);
      if (storyData) {
        // In a real app, you'd save this to persistent storage
        console.log('Story saved:', storyData);
        Alert.alert('Success', 'Story saved successfully!');
      }
    }
  };

  if (isLoading && !story) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#000000" />
        <LinearGradient
          colors={["rgba(78, 84, 200, 0.25)", "rgba(143, 148, 251, 0.10)", 'rgba(0,0,0,0.8)']}
          style={styles.background}
        />
        <View style={styles.loadingContent}>
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.loadingText}>Generating your story...</Text>
        </View>
      </View>
    );
  }

  if (!story) {
    return (
      <View style={styles.errorContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#000000" />
        <Text style={styles.errorText}>Failed to load story</Text>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      <LinearGradient
        colors={["rgba(78, 84, 200, 0.15)", "rgba(143, 148, 251, 0.08)", 'rgba(0,0,0,0.9)']}
        style={styles.background}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {story.title || 'Your Story'}
        </Text>
        <TouchableOpacity style={styles.headerButton} onPress={handleSave}>
          <Ionicons name="bookmark-outline" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Story Content */}
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.storyContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <Text style={styles.storyTitle}>{story.title}</Text>
          
          <View style={styles.storyContent}>
            {story.fullStory.map((content, index) => (
              <Text key={index} style={styles.storyText}>
                {content}
              </Text>
            ))}
          </View>

          {isLoading && (
            <View style={styles.loadingIndicator}>
              <ActivityIndicator size="small" color="#7B68EE" />
              <Text style={styles.loadingText}>Generating next part...</Text>
            </View>
          )}
        </Animated.View>
      </ScrollView>

      {/* Choices */}
      {story.currentChoices.length > 0 && !isLoading && (
        <Animated.View
          style={[
            styles.choicesContainer,
            {
              opacity: choiceAnim,
              transform: [
                {
                  translateY: choiceAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [50, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={styles.actionPrompt}>{story.actionPrompt}</Text>
          
          {story.currentChoices.map((choice, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.choiceButton,
                selectedChoice === choice && styles.choiceButtonSelected,
              ]}
              onPress={() => handleChoiceSelect(choice)}
              disabled={isLoading}
            >
              <LinearGradient
                colors={selectedChoice === choice ? ['#7B68EE', '#4A90E2'] : ['#2A2A2A', '#1A1A1A']}
                style={styles.choiceGradient}
              >
                <Text style={styles.choiceText}>{choice}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </Animated.View>
      )}
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
  loadingContainer: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContent: {
    alignItems: 'center',
  },
  loadingText: {
    color: '#ffffff',
    fontSize: 16,
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#ffffff',
    fontSize: 18,
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row' as const,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  headerButton: {
    padding: 8,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600' as const,
    flex: 1,
    textAlign: 'center' as const,
    marginHorizontal: 16,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  storyContainer: {
    flex: 1,
  },
  storyTitle: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '700' as const,
    textAlign: 'center' as const,
    marginBottom: 24,
  },
  storyContent: {
    marginBottom: 20,
  },
  storyText: {
    color: '#ffffff',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  loadingIndicator: {
    flexDirection: 'row' as const,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  choicesContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  actionPrompt: {
    color: '#A9B0C6',
    fontSize: 16,
    textAlign: 'center' as const,
    marginBottom: 16,
    fontStyle: 'italic' as const,
  },
  choiceButton: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  choiceButtonSelected: {
    transform: [{ scale: 0.98 }],
  },
  choiceGradient: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  choiceText: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center' as const,
    fontWeight: '500' as const,
  },
  backButton: {
    backgroundColor: '#7B68EE',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600' as const,
  },
};
