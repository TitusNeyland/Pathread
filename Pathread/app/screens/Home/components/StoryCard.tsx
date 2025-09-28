import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { homeStyles as styles } from '../styles/home.styles';

type StoryCardProps = {
  title: string;
  image?: string;
  onPress?: () => void;
  size?: 'small' | 'large';
  isMain?: boolean;
  isPrevious?: boolean;
  isNewStory?: boolean;
};

export function StoryCard({ 
  title, 
  image, 
  onPress, 
  size = 'small',
  isMain = false,
  isPrevious = false,
  isNewStory = false
}: StoryCardProps) {
  const handlePress = () => {
    if (onPress) {
      onPress();
    }
  };

  if (isMain) {
    return (
      <TouchableOpacity 
        style={styles.mainStoryCard} 
        onPress={handlePress}
        activeOpacity={0.8}
      >
        {image ? (
          <Image source={{ uri: image }} style={{ width: '100%', height: '100%', resizeMode: 'cover' }} />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>Continue Your Story</Text>
          </View>
        )}
        <View style={styles.mainStoryOverlay}>
          <Text style={styles.mainStoryText} numberOfLines={0}>
            {title.split('\n').map((line, index) => (
              <Text key={index}>
                {line}
                {index < title.split('\n').length - 1 && '\n'}
              </Text>
            ))}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  if (isPrevious) {
    return (
      <TouchableOpacity 
        style={styles.previousStoryCard} 
        onPress={handlePress}
        activeOpacity={0.8}
      >
        {image ? (
          <Image source={{ uri: image }} style={{ width: '100%', height: '100%', resizeMode: 'cover' }} />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>Previous Story</Text>
          </View>
        )}
        <View style={styles.previousStoryOverlay}>
          <Text style={styles.previousStoryText} numberOfLines={0}>
            {title.split('\n').map((line, index) => (
              <Text key={index}>
                {line}
                {index < title.split('\n').length - 1 && '\n'}
              </Text>
            ))}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  if (isNewStory) {
    return (
      <TouchableOpacity 
        style={styles.newStoryCard} 
        onPress={handlePress}
        activeOpacity={0.8}
      >
        {image ? (
          <Image source={{ uri: image }} style={{ width: '100%', height: '100%', resizeMode: 'cover' }} />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>New Story</Text>
          </View>
        )}
        <View style={styles.newStoryOverlay}>
          <Text style={styles.newStoryText} numberOfLines={0}>
            {title.split('\n').map((line, index) => (
              <Text key={index}>
                {line}
                {index < title.split('\n').length - 1 && '\n'}
              </Text>
            ))}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity 
      style={styles.storyCard} 
      onPress={handlePress}
      activeOpacity={0.8}
    >
      {image ? (
        <Image source={{ uri: image }} style={{ width: '100%', height: '100%', resizeMode: 'cover' }} />
      ) : (
        <View style={styles.placeholderImage}>
          <Text style={styles.placeholderText}>Story</Text>
        </View>
      )}
      <View style={styles.storyOverlay}>
        <Text style={styles.storyTitle} numberOfLines={0}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
