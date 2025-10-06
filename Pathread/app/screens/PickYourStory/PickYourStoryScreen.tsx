import React, { useMemo, useRef, useState, useEffect, useCallback, memo } from 'react';
import { View, Text, TouchableOpacity, StatusBar, Animated, ScrollView, Image, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { pickYourStoryStyles as styles } from './styles/pickYourStory.styles';

type Story = {
  id: string;
  title: string;
  description: string;
  thumbnail: any;
};

type StoryCardProps = { story: Story; isActive: boolean; onPress: (id: string) => void };

const StoryCard = memo(({ story, isActive, onPress }: StoryCardProps) => {
  return (
    <TouchableOpacity
      onPress={() => onPress(story.id)}
      activeOpacity={1}
      style={[styles.storyCard, isActive && styles.storyCardActive]}
    >
      <Image source={story.thumbnail} style={styles.thumbnail} fadeDuration={0} />
      <View style={styles.storyContent}>
        <Text style={styles.storyTitle}>{story.title}</Text>
        <Text style={styles.storyDescription}>{story.description}</Text>
      </View>
    </TouchableOpacity>
  );
});

export default function PickYourStoryScreen() {
  const router = useRouter();
  const { genre, length, tone, perspective, difficulty } = useLocalSearchParams<{
    genre?: string;
    length?: string;
    tone?: string;
    perspective?: string;
    difficulty?: string;
  }>();

  const [selectedStory, setSelectedStory] = useState<string | null>(null);
  const [stories, setStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Animation values
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const headerTranslateY = useRef(new Animated.Value(-20)).current;
  const storiesOpacity = useRef(new Animated.Value(0)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;

  // Function to fetch AI-generated story hooks
  const fetchStoryHooks = async () => {
    if (!genre) {
      setError('No genre selected');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('https://api-tbx2d52hwq-uc.a.run.app/generateStoryHooks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ genre }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate story hooks');
      }

      const data = await response.json();
      const generatedStories = data.storyHooks.map((hook: any, index: number) => ({
        id: hook.id,
        title: hook.title,
        description: hook.description,
        thumbnail: getThumbnailForGenre(genre, index),
      }));

      setStories(generatedStories);
      setError(null);
    } catch (err) {
      console.error('Error fetching story hooks:', err);
      setError('Failed to load story options');
      // Fallback to default stories
      setStories(getFallbackStories(genre));
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to get appropriate thumbnails for different genres
  const getThumbnailForGenre = (genre: string, index: number) => {
    const thumbnailMap: Record<string, any[]> = {
      'horror': [
        require('../../../assets/images/story-cards/mystical.png'),
        require('../../../assets/images/story-cards/story1.png'),
        require('../../../assets/images/story-cards/ex1.png')
      ],
      'romance': [
        require('../../../assets/images/story-cards/lovestory.png'),
        require('../../../assets/images/story-cards/story2.png'),
        require('../../../assets/images/story-cards/ex2.png')
      ],
      'scifi': [
        require('../../../assets/images/story-cards/story3.png'),
        require('../../../assets/images/story-cards/continuereading.png'),
        require('../../../assets/images/story-cards/ex3.png')
      ],
      'fantasy': [
        require('../../../assets/images/story-cards/fantasy.png'),
        require('../../../assets/images/story-cards/mystical.png'),
        require('../../../assets/images/story-cards/continuereading2.png')
      ],
      'mystery': [
        require('../../../assets/images/story-cards/mystical.png'),
        require('../../../assets/images/story-cards/citylights.png'),
        require('../../../assets/images/story-cards/ex1.png')
      ],
      'adventure': [
        require('../../../assets/images/story-cards/orangemountains.png'),
        require('../../../assets/images/story-cards/ocean.png'),
        require('../../../assets/images/story-cards/continuereading3.png')
      ]
    };

    const thumbnails = thumbnailMap[genre] || [
      require('../../../assets/images/story-cards/story1.png'),
      require('../../../assets/images/story-cards/story2.png'),
      require('../../../assets/images/story-cards/story3.png')
    ];

    return thumbnails[index % thumbnails.length];
  };

  // Fallback stories for when AI generation fails
  const getFallbackStories = (genre: string): Story[] => {
    const fallbackMap: Record<string, Story[]> = {
      'horror': [
        {
          id: 'fallback-horror-1',
          title: 'The Haunted House',
          description: 'You discover an old mansion that holds dark secrets from the past.',
          thumbnail: require('../../../assets/images/story-cards/mystical.png'),
        },
        {
          id: 'fallback-horror-2',
          title: 'Midnight Visitor',
          description: 'Something is knocking at your door, but no one should be there at this hour.',
          thumbnail: require('../../../assets/images/story-cards/story1.png'),
        },
        {
          id: 'fallback-horror-3',
          title: 'The Shadow',
          description: 'You notice a shadow that moves independently of any light source.',
          thumbnail: require('../../../assets/images/story-cards/ex1.png'),
        }
      ],
      'romance': [
        {
          id: 'fallback-romance-1',
          title: 'Unexpected Meeting',
          description: 'A chance encounter changes everything you thought you knew about love.',
          thumbnail: require('../../../assets/images/story-cards/lovestory.png'),
        },
        {
          id: 'fallback-romance-2',
          title: 'Second Chances',
          description: 'An old flame returns, bringing with them memories and new possibilities.',
          thumbnail: require('../../../assets/images/story-cards/story2.png'),
        },
        {
          id: 'fallback-romance-3',
          title: 'Love Letters',
          description: 'You find a box of old letters that reveal a hidden love story.',
          thumbnail: require('../../../assets/images/story-cards/ex2.png'),
        }
      ]
    };

    return fallbackMap[genre] || [
      {
        id: 'fallback-generic-1',
        title: 'The Beginning',
        description: 'An intriguing story awaits your discovery.',
        thumbnail: require('../../../assets/images/story-cards/story1.png'),
      },
      {
        id: 'fallback-generic-2',
        title: 'New Horizons',
        description: 'A journey into the unknown begins.',
        thumbnail: require('../../../assets/images/story-cards/story2.png'),
      },
      {
        id: 'fallback-generic-3',
        title: 'Mystery Unfolds',
        description: 'Secrets are waiting to be revealed.',
        thumbnail: require('../../../assets/images/story-cards/story3.png'),
      }
    ];
  };

  useEffect(() => {
    fetchStoryHooks();
  }, [genre]);

  useEffect(() => {
    if (!isLoading && stories.length > 0) {
      Animated.sequence([
        Animated.parallel([
          Animated.timing(headerOpacity, { toValue: 1, duration: 350, useNativeDriver: true }),
          Animated.timing(headerTranslateY, { toValue: 0, duration: 350, useNativeDriver: true }),
        ]),
        Animated.timing(storiesOpacity, { toValue: 1, duration: 350, useNativeDriver: true }),
        Animated.timing(buttonOpacity, { toValue: 1, duration: 350, useNativeDriver: true }),
      ]).start();
    }
  }, [isLoading, stories, headerOpacity, headerTranslateY, storiesOpacity, buttonOpacity]);

  const onContinue = () => {
    if (!selectedStory) return;
    
    // Find the selected story to get its description
    const selectedStoryData = stories.find(story => story.id === selectedStory);
    
    router.push({
      pathname: '/story-reader',
      params: {
        hookId: selectedStory,
        hookDescription: selectedStoryData?.description || '',
        genre,
        length,
        tone,
        perspective,
        difficulty,
      },
    });
  };

  const handleSelect = useCallback((id: string) => {
    setSelectedStory(id);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      {/* Background gradient to match other screens */}
      <LinearGradient
        colors={["rgba(78, 84, 200, 0.25)", "rgba(143, 148, 251, 0.10)", 'rgba(0,0,0,0.6)']}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={styles.background}
        pointerEvents="none"
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={{ opacity: headerOpacity, transform: [{ translateY: headerTranslateY }] }}
        >
          <Text style={styles.heading}>Pick a Story</Text>
          <Text style={styles.subheading}>Choose a hook that sparks your curiosity</Text>
        </Animated.View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#7c3aed" />
            <Text style={styles.loadingText}>Generating story options...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={fetchStoryHooks} style={styles.retryButton}>
              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Animated.View style={[styles.storiesContainer, { opacity: storiesOpacity }]}>
            {stories.map((story) => (
              <StoryCard
                key={story.id}
                story={story}
                isActive={selectedStory === story.id}
                onPress={handleSelect}
              />
            ))}
          </Animated.View>
        )}
      </ScrollView>

      <Animated.View style={[styles.ctaWrapper, { opacity: buttonOpacity }]}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={onContinue}
          disabled={!selectedStory}
          style={[styles.cta, !selectedStory && styles.ctaDisabled]}
        >
          <LinearGradient
            colors={[ '#2563eb', '#7c3aed' ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.ctaGradient}
          >
            <Text style={styles.ctaText}>Continue</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}
