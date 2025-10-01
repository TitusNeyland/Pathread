import React, { useMemo, useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, StatusBar, ScrollView, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { storyTypeStyles as styles } from './styles/storyType.styles';

type Genre = {
  key: string;
  title: string;
  image: any;
};

export default function StoryTypeScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);

  // Animation values
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const headerTranslateY = useRef(new Animated.Value(-30)).current;
  const subheaderOpacity = useRef(new Animated.Value(0)).current;
  const subheaderTranslateY = useRef(new Animated.Value(-20)).current;
  const rowsOpacity = useRef(new Animated.Value(0)).current;
  const rowsTranslateY = useRef(new Animated.Value(40)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;
  const buttonTranslateY = useRef(new Animated.Value(30)).current;

  const genres: Genre[] = useMemo(
    () => [
      { key: 'horror', title: 'Horror', image: require('../../../assets/images/story-cards/story1.png') },
      { key: 'romance', title: 'Romance', image: require('../../../assets/images/story-cards/story2.png') },
      { key: 'scifi', title: 'Sci-Fi', image: require('../../../assets/images/story-cards/story3.png') },
      { key: 'fantasy', title: 'Fantasy', image: require('../../../assets/images/story-cards/fantasy.png') },
      { key: 'mystery', title: 'Mystery', image: require('../../../assets/images/story-cards/mystical.png') },
      { key: 'adventure', title: 'Adventure', image: require('../../../assets/images/story-cards/orangemountains.png') },
      { key: 'comedy', title: 'Comedy', image: require('../../../assets/images/story-cards/ex2.png') },
      { key: 'mythology', title: 'Mythology', image: require('../../../assets/images/story-cards/ex3.png') },
      { key: 'history', title: 'History', image: require('../../../assets/images/story-cards/citylights.png') },
      { key: 'thriller', title: 'Thriller', image: require('../../../assets/images/story-cards/ex1.png') },
      { key: 'drama', title: 'Drama', image: require('../../../assets/images/story-cards/lovestory.png') },
      { key: 'action', title: 'Action', image: require('../../../assets/images/story-cards/ocean.png') },
      { key: 'supernatural', title: 'Supernatural', image: require('../../../assets/images/story-cards/continuereading.png') },
      { key: 'western', title: 'Western', image: require('../../../assets/images/story-cards/continuereading2.png') },
      { key: 'steampunk', title: 'Steampunk', image: require('../../../assets/images/story-cards/continuereading3.png') },
      { key: 'detective', title: 'Detective', image: require('../../../assets/images/story-cards/story1.png') },
      { key: 'romantic', title: 'Romantic', image: require('../../../assets/images/story-cards/story2.png') },
      { key: 'space', title: 'Space', image: require('../../../assets/images/story-cards/story3.png') },
      { key: 'magic', title: 'Magic', image: require('../../../assets/images/story-cards/fantasy.png') },
      { key: 'suspense', title: 'Suspense', image: require('../../../assets/images/story-cards/mystical.png') },
      { key: 'exploration', title: 'Exploration', image: require('../../../assets/images/story-cards/orangemountains.png') },
      { key: 'humor', title: 'Humor', image: require('../../../assets/images/story-cards/ex2.png') },
      { key: 'legends', title: 'Legends', image: require('../../../assets/images/story-cards/ex3.png') },
      { key: 'historical', title: 'Historical', image: require('../../../assets/images/story-cards/citylights.png') },
      { key: 'psychological', title: 'Psychological', image: require('../../../assets/images/story-cards/ex1.png') },
    ],
    []
  );

  const onContinue = () => {
    if (!selected) return;
    router.push({ pathname: '/tone-length', params: { genre: selected } });
  };

  // Animation effect when component mounts
  useEffect(() => {
    // Reset all animations
    headerOpacity.setValue(0);
    headerTranslateY.setValue(-30);
    subheaderOpacity.setValue(0);
    subheaderTranslateY.setValue(-20);
    rowsOpacity.setValue(0);
    rowsTranslateY.setValue(40);
    buttonOpacity.setValue(0);
    buttonTranslateY.setValue(30);

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
      // Subheader animation
      Animated.parallel([
        Animated.timing(subheaderOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(subheaderTranslateY, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
      // Rows animation
      Animated.parallel([
        Animated.timing(rowsOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(rowsTranslateY, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      // Button animation
      Animated.parallel([
        Animated.timing(buttonOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(buttonTranslateY, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  const renderItem = (item: Genre) => {
    const isActive = selected === item.key;
    return (
      <View style={[
        styles.cardWrapper, 
        isActive && styles.cardWrapperActive,
        isActive && { transform: [{ scale: 1.05 }] }
      ]}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => setSelected(item.key)}
          style={styles.card}
        >
          <Image source={item.image} style={styles.cardImage} />
          <View 
            style={[
              styles.cardOverlay,
              !isActive && { backgroundColor: 'rgba(0,0,0,0.4)' }
            ]} 
          />
          <Text
            style={styles.cardTitle}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.7}
          >
            {item.title}
          </Text>
          {isActive && (
            <View style={styles.checkmarkContainer}>
              <Text style={styles.checkmark}>✓</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  const rows: Genre[][] = useMemo(() => {
    const size = Math.ceil(genres.length / 3);
    return [
      genres.slice(0, size),
      genres.slice(size, size * 2),
      genres.slice(size * 2),
    ];
  }, [genres]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        <Animated.View
          style={[
            {
              opacity: headerOpacity,
              transform: [{ translateY: headerTranslateY }],
            }
          ]}
        >
          <Text style={styles.heading}>Choose a Genre</Text>
        </Animated.View>
        
        <Animated.View
          style={[
            {
              opacity: subheaderOpacity,
              transform: [{ translateY: subheaderTranslateY }],
            }
          ]}
        >
          <Text style={styles.subheading}>Pick the world you want to explore</Text>
        </Animated.View>

        <Animated.View
          style={[
            {
              opacity: rowsOpacity,
              transform: [{ translateY: rowsTranslateY }],
            }
          ]}
        >
          {rows.map((row, idx) => (
            <View key={`row-${idx}`} style={styles.carouselWrapper}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.carouselRow}
                decelerationRate="fast"
                snapToAlignment="start"
                snapToInterval={162}
                scrollEventThrottle={16}
                bounces={true}
              >
                {row.map((g) => (
                  <View key={g.key} style={styles.carouselItem}>
                    {renderItem(g)}
                  </View>
                ))}
              </ScrollView>
            </View>
          ))}
        </Animated.View>
      </ScrollView>

      <Animated.View
        style={[
          {
            opacity: buttonOpacity,
            transform: [{ translateY: buttonTranslateY }],
          }
        ]}
      >
        <TouchableOpacity
          activeOpacity={selected ? 0.95 : 1}
          disabled={!selected}
          onPress={onContinue}
          style={[styles.cta, !selected && styles.ctaDisabled]}
        >
          <LinearGradient
            colors={["#4A90E2", "#7B68EE"]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.ctaGradient}
          >
            <Text style={styles.ctaText}>Continue</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}


