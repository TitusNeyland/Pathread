import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { homeStyles as styles } from './styles/home.styles';
import { StoryCard } from './components/StoryCard';

export default function HomeScreen() {
  const handleStoryPress = (storyTitle: string) => {
    console.log(`Opening story: ${storyTitle}`);
    // TODO: Navigate to story reader
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
        <View style={styles.header}>
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
        </View>

        {/* Continue Story / Previous Story / Begin New Story Section */}
        <View style={styles.continueSection}>
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
              onPress={() => handleStoryPress('Begin a New Story')}
              isNewStory={true}
            />
          </ScrollView>
        </View>

        {/* Continue Reading Section */}
        <View style={styles.section}>
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
            {continueReadingStories.map((story) => (
              <StoryCard
                key={story.id}
                title={story.title}
                onPress={() => handleStoryPress(story.title)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Read Other Stories Section */}
        <View style={styles.section}>
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
            {otherStories.map((story) => (
              <StoryCard
                key={story.id}
                title={story.title}
                onPress={() => handleStoryPress(story.title)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Popular Stories Section */}
        <View style={styles.section}>
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
            {popularStories.map((story) => (
              <StoryCard
                key={story.id}
                title={story.title}
                onPress={() => handleStoryPress(story.title)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Recommended For You Section */}
        <View style={styles.section}>
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
        </View>

        {/* Trending Now Section */}
        <View style={styles.section}>
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
        </View>

        {/* New Releases Section */}
        <View style={styles.section}>
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
        </View>

        {/* Short Reads Section */}
        <View style={styles.section}>
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
        </View>

        {/* Saved Stories Section */}
        <View style={styles.section}>
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
        </View>
      </ScrollView>
    </View>
  );
}
