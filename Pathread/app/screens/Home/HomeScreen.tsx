import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StatusBar, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { homeStyles as styles } from './styles/home.styles';
import { StoryCard } from './components/StoryCard';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();
  // Animation values
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const headerTranslateY = useRef(new Animated.Value(-30)).current;
  const mainSectionOpacity = useRef(new Animated.Value(0)).current;
  const mainSectionScale = useRef(new Animated.Value(0.9)).current;
  const mainSectionTranslateY = useRef(new Animated.Value(40)).current;
  const sectionsOpacity = useRef(new Animated.Value(0)).current;
  const sectionsTranslateY = useRef(new Animated.Value(30)).current;

  const handleStoryPress = (storyTitle: string) => {
    console.log(`Opening story: ${storyTitle}`);
    // Navigate to loading screen to generate/load the story
    router.push('/story-loading' as any);
  };

  const handleProfilePress = () => {
    console.log('Opening profile');
    // TODO: Navigate to profile
  };

  // Sample story data - in a real app, this would come from an API
  const continueReadingStories = [
    { title: 'Continue Reading', id: '1' },
    { title: 'Chapter 3', id: '2' },
    { title: 'Next Episode', id: '3' },
  ];

  const otherStories = [
    { title: 'Moonlight Forest', id: '4' },
    { title: 'Space Adventure', id: '5' },
    { title: 'Love Story', id: '6' },
    { title: 'Mystery Tale', id: '7' },
    { title: 'Fantasy Quest', id: '8' },
  ];

  const popularStories = [
    { title: 'Dark Forest', id: '9' },
    { title: 'Galaxy Dreams', id: '10' },
    { title: 'Mountain Peak', id: '11' },
    { title: 'Ocean Depths', id: '12' },
    { title: 'City Lights', id: '13' },
  ];

  const recommendedStories = [
    { title: 'For You', id: '14' },
    { title: 'Personal Pick', id: '15' },
    { title: 'AI Choice', id: '16' },
    { title: 'Your Style', id: '17' },
  ];

  const trendingStories = [
    { title: 'Trending #1', id: '18' },
    { title: 'Viral Story', id: '19' },
    { title: 'Hot Read', id: '20' },
    { title: 'Popular Now', id: '21' },
  ];

  const newReleases = [
    { title: 'Fresh Story', id: '22' },
    { title: 'Just Added', id: '23' },
    { title: 'New Chapter', id: '24' },
    { title: 'Latest', id: '25' },
  ];

  const shortReads = [
    { title: 'Quick Read', id: '26' },
    { title: '5 Min Story', id: '27' },
    { title: 'Short Tale', id: '28' },
    { title: 'Brief Story', id: '29' },
  ];

  const savedStories = [
    { title: 'Bookmarked', id: '30' },
    { title: 'Saved Story', id: '31' },
    { title: 'Favorites', id: '32' },
    { title: 'Keep Reading', id: '33' },
  ];

  // Animation effect when component mounts
  useEffect(() => {
    // Reset all animations
    headerOpacity.setValue(0);
    headerTranslateY.setValue(-30);
    mainSectionOpacity.setValue(0);
    mainSectionScale.setValue(0.9);
    mainSectionTranslateY.setValue(40);
    sectionsOpacity.setValue(0);
    sectionsTranslateY.setValue(30);

    // Animate elements in sequence
    Animated.sequence([
      // Header animation
      Animated.parallel([
        Animated.timing(headerOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(headerTranslateY, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      // Main section animation
      Animated.parallel([
        Animated.timing(mainSectionOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(mainSectionScale, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(mainSectionTranslateY, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      // Sections animation
      Animated.parallel([
        Animated.timing(sectionsOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(sectionsTranslateY, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      {/* Background */}
      <LinearGradient
        colors={["rgba(78, 84, 200, 0.15)", "rgba(143, 148, 251, 0.08)", 'rgba(0,0,0,0.8)']}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={styles.background}
      />

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* Header */}
        <Animated.View 
          style={[
            styles.header,
            {
              opacity: headerOpacity,
              transform: [{ translateY: headerTranslateY }],
            }
          ]}
        >
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.userName}>Titus</Text>
          </View>
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={handleProfilePress}
            activeOpacity={0.7}
          >
            <Ionicons name="person-outline" size={20} color="#ffffff" />
          </TouchableOpacity>
        </Animated.View>

        {/* Continue Story / Previous Story / Begin New Story Section */}
        <Animated.View 
          style={[
            styles.continueSection,
            {
              opacity: mainSectionOpacity,
              transform: [
                { scale: mainSectionScale },
                { translateY: mainSectionTranslateY }
              ],
            }
          ]}
        >
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.mainStoriesScrollView}
            contentContainerStyle={styles.continueRow}
            decelerationRate="fast"
            snapToInterval={200}
            snapToAlignment="start"
            pagingEnabled={false}
            bounces={true}
            scrollEventThrottle={16}
          >
            <StoryCard
              title={`CONTINUE${'\n'}YOUR STORY`}
              onPress={() => handleStoryPress('Continue Your Story')}
              isMain={true}
            />
            <StoryCard
              title={`PREVIOUS${'\n'}STORY`}
              onPress={() => handleStoryPress('Previous Story')}
              isPrevious={true}
            />
            <StoryCard
              title={`BEGIN A${'\n'}NEW STORY`}
              onPress={() => router.push('/story-type' as any)}
              isNewStory={true}
            />
          </ScrollView>
        </Animated.View>

        {/* Continue Reading Section */}
        <Animated.View 
          style={[
            styles.section,
            {
              opacity: sectionsOpacity,
              transform: [{ translateY: sectionsTranslateY }],
            }
          ]}
        >
          <Text style={styles.sectionTitle}>CONTINUE READING</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.storiesScrollView}
            contentContainerStyle={styles.storiesRow}
            decelerationRate="fast"
            snapToInterval={156}
            snapToAlignment="start"
            pagingEnabled={false}
            bounces={true}
            scrollEventThrottle={16}
          >
            {continueReadingStories.map((story, index) => {
              let imageSource;
              if (index === 0) {
                imageSource = require('../../../assets/images/story-cards/continuereading.png');
              } else if (index === 1) {
                imageSource = require('../../../assets/images/story-cards/continuereading2.png');
              } else if (index === 2) {
                imageSource = require('../../../assets/images/story-cards/continuereading3.png');
              }
              
              return (
                <StoryCard
                  key={story.id}
                  title={story.title}
                  onPress={() => handleStoryPress(story.title)}
                  image={imageSource}
                />
              );
            })}
          </ScrollView>
        </Animated.View>

        {/* Read Other Stories Section */}
        <Animated.View 
          style={[
            styles.section,
            {
              opacity: sectionsOpacity,
              transform: [{ translateY: sectionsTranslateY }],
            }
          ]}
        >
          <Text style={styles.sectionTitle}>READ OTHER STORIES</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.storiesScrollView}
            contentContainerStyle={styles.storiesRow}
            decelerationRate="fast"
            snapToInterval={156}
            snapToAlignment="start"
            pagingEnabled={false}
            bounces={true}
            scrollEventThrottle={16}
          >
            {otherStories.map((story, index) => {
              let imageSource;
              if (index === 0) {
                imageSource = require('../../../assets/images/story-cards/story1.png');
              } else if (index === 1) {
                imageSource = require('../../../assets/images/story-cards/story2.png');
              } else if (index === 2) {
                imageSource = require('../../../assets/images/story-cards/lovestory.png');
              } else if (story.title === 'Mystery Tale') {
                imageSource = require('../../../assets/images/story-cards/mystical.png');
              } else if (story.title === 'Fantasy Quest') {
                imageSource = require('../../../assets/images/story-cards/fantasy.png');
              }
              
              return (
                <StoryCard
                  key={story.id}
                  title={story.title}
                  onPress={() => handleStoryPress(story.title)}
                  image={imageSource}
                />
              );
            })}
          </ScrollView>
        </Animated.View>

        {/* Popular Stories Section */}
        <Animated.View 
          style={[
            styles.section,
            {
              opacity: sectionsOpacity,
              transform: [{ translateY: sectionsTranslateY }],
            }
          ]}
        >
          <Text style={styles.sectionTitle}>POPULAR STORIES</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.storiesScrollView}
            contentContainerStyle={styles.storiesRow}
            decelerationRate="fast"
            snapToInterval={156}
            snapToAlignment="start"
            pagingEnabled={false}
            bounces={true}
            scrollEventThrottle={16}
          >
            {popularStories.map((story, index) => {
              let imageSource;
              if (index === 0) {
                imageSource = require('../../../assets/images/story-cards/ex1.png');
              } else if (index === 1) {
                imageSource = require('../../../assets/images/story-cards/ex2.png');
              } else if (index === 2) {
                imageSource = require('../../../assets/images/story-cards/ex3.png');
              } else if (story.title === 'Ocean Depths') {
                imageSource = require('../../../assets/images/story-cards/ocean.png');
              } else if (story.title === 'City Lights') {
                imageSource = require('../../../assets/images/story-cards/citylights.png');
              }
              
              return (
                <StoryCard
                  key={story.id}
                  title={story.title}
                  onPress={() => handleStoryPress(story.title)}
                  image={imageSource}
                />
              );
            })}
          </ScrollView>
        </Animated.View>

        {/* Recommended For You Section */}
        <Animated.View 
          style={[
            styles.section,
            {
              opacity: sectionsOpacity,
              transform: [{ translateY: sectionsTranslateY }],
            }
          ]}
        >
          <Text style={styles.sectionTitle}>RECOMMENDED FOR YOU</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.storiesScrollView}
            contentContainerStyle={styles.storiesRow}
            decelerationRate="fast"
            snapToInterval={156}
            snapToAlignment="start"
            pagingEnabled={false}
            bounces={true}
            scrollEventThrottle={16}
          >
            {recommendedStories.map((story) => (
              <StoryCard
                key={story.id}
                title={story.title}
                onPress={() => handleStoryPress(story.title)}
              />
            ))}
          </ScrollView>
        </Animated.View>

        {/* Trending Now Section */}
        <Animated.View 
          style={[
            styles.section,
            {
              opacity: sectionsOpacity,
              transform: [{ translateY: sectionsTranslateY }],
            }
          ]}
        >
          <Text style={styles.sectionTitle}>TRENDING NOW</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.storiesScrollView}
            contentContainerStyle={styles.storiesRow}
            decelerationRate="fast"
            snapToInterval={156}
            snapToAlignment="start"
            pagingEnabled={false}
            bounces={true}
            scrollEventThrottle={16}
          >
            {trendingStories.map((story) => (
              <StoryCard
                key={story.id}
                title={story.title}
                onPress={() => handleStoryPress(story.title)}
              />
            ))}
          </ScrollView>
        </Animated.View>

        {/* New Releases Section */}
        <Animated.View 
          style={[
            styles.section,
            {
              opacity: sectionsOpacity,
              transform: [{ translateY: sectionsTranslateY }],
            }
          ]}
        >
          <Text style={styles.sectionTitle}>NEW RELEASES</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.storiesScrollView}
            contentContainerStyle={styles.storiesRow}
            decelerationRate="fast"
            snapToInterval={156}
            snapToAlignment="start"
            pagingEnabled={false}
            bounces={true}
            scrollEventThrottle={16}
          >
            {newReleases.map((story) => (
              <StoryCard
                key={story.id}
                title={story.title}
                onPress={() => handleStoryPress(story.title)}
              />
            ))}
          </ScrollView>
        </Animated.View>

        {/* Short Reads Section */}
        <Animated.View 
          style={[
            styles.section,
            {
              opacity: sectionsOpacity,
              transform: [{ translateY: sectionsTranslateY }],
            }
          ]}
        >
          <Text style={styles.sectionTitle}>SHORT READS</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.storiesScrollView}
            contentContainerStyle={styles.storiesRow}
            decelerationRate="fast"
            snapToInterval={156}
            snapToAlignment="start"
            pagingEnabled={false}
            bounces={true}
            scrollEventThrottle={16}
          >
            {shortReads.map((story) => (
              <StoryCard
                key={story.id}
                title={story.title}
                onPress={() => handleStoryPress(story.title)}
              />
            ))}
          </ScrollView>
        </Animated.View>

        {/* Saved Stories Section */}
        <Animated.View 
          style={[
            styles.section,
            {
              opacity: sectionsOpacity,
              transform: [{ translateY: sectionsTranslateY }],
            }
          ]}
        >
          <Text style={styles.sectionTitle}>SAVED STORIES</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.storiesScrollView}
            contentContainerStyle={styles.storiesRow}
            decelerationRate="fast"
            snapToInterval={156}
            snapToAlignment="start"
            pagingEnabled={false}
            bounces={true}
            scrollEventThrottle={16}
          >
            {savedStories.map((story) => (
              <StoryCard
                key={story.id}
                title={story.title}
                onPress={() => handleStoryPress(story.title)}
              />
            ))}
          </ScrollView>
        </Animated.View>
      </ScrollView>
    </View>
  );
}
