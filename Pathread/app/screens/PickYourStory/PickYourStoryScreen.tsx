import React, { useMemo, useRef, useState, useEffect, useCallback, memo } from 'react';
import { View, Text, TouchableOpacity, StatusBar, Animated, ScrollView, Image } from 'react-native';
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

  // Animation values
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const headerTranslateY = useRef(new Animated.Value(-20)).current;
  const storiesOpacity = useRef(new Animated.Value(0)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(headerOpacity, { toValue: 1, duration: 350, useNativeDriver: true }),
        Animated.timing(headerTranslateY, { toValue: 0, duration: 350, useNativeDriver: true }),
      ]),
      Animated.timing(storiesOpacity, { toValue: 1, duration: 350, useNativeDriver: true }),
      Animated.timing(buttonOpacity, { toValue: 1, duration: 350, useNativeDriver: true }),
    ]).start();
  }, [headerOpacity, headerTranslateY, storiesOpacity, buttonOpacity]);

  const stories: Story[] = useMemo(
    () => [
      {
        id: 'moonlight-pact',
        title: 'Moonlight Pact',
        description: 'On the eve of a blood moon, you discover a secret that could bind you to a world beyond your own.',
        thumbnail: require('../../../assets/images/story-cards/mystical.png'),
      },
      {
        id: 'echoes-tomorrow',
        title: 'Echoes of Tomorrow',
        description: 'A voice from the future warns you of a choice that will change everything.',
        thumbnail: require('../../../assets/images/story-cards/story3.png'),
      },
      {
        id: 'silent-city',
        title: 'The Silent City',
        description: 'Everyone vanished overnight, except you. The streets are waiting... but for what?',
        thumbnail: require('../../../assets/images/story-cards/citylights.png'),
      },
    ],
    []
  );

  const onContinue = () => {
    if (!selectedStory) return;
    router.push({
      pathname: '/story-reader',
      params: {
        hookId: selectedStory,
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
