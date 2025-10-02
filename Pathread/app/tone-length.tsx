import React, { useMemo, useRef, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StatusBar, Animated, ScrollView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Fonts } from '@/constants/theme';
import { useLocalSearchParams, useRouter } from 'expo-router';

type LengthOption = 'short' | 'medium' | 'long';
type ToneOption = 'light' | 'neutral' | 'dark';
type PerspectiveOption = 'first' | 'third' | 'omniscient' | 'second';
type DifficultyOption = 'easy' | 'normal' | 'hard';

export default function ToneLengthScreen() {
  const router = useRouter();
  const { genre } = useLocalSearchParams<{ genre?: string }>();

  const [length, setLength] = useState<LengthOption | null>(null);
  const [tone, setTone] = useState<ToneOption>('neutral');
  const [perspective, setPerspective] = useState<PerspectiveOption>('first');
  const [difficulty, setDifficulty] = useState<DifficultyOption>('normal');

  // Simple page fade/slide-in
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const headerTranslateY = useRef(new Animated.Value(-20)).current;
  const sectionsOpacity = useRef(new Animated.Value(0)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(headerOpacity, { toValue: 1, duration: 350, useNativeDriver: true }),
        Animated.timing(headerTranslateY, { toValue: 0, duration: 350, useNativeDriver: true }),
      ]),
      Animated.timing(sectionsOpacity, { toValue: 1, duration: 350, useNativeDriver: true }),
      Animated.timing(buttonOpacity, { toValue: 1, duration: 350, useNativeDriver: true }),
    ]).start();
  }, [headerOpacity, headerTranslateY, sectionsOpacity, buttonOpacity]);

  const lengthOptions: { key: LengthOption; label: string }[] = useMemo(
    () => [
      { key: 'short', label: 'Short' },
      { key: 'medium', label: 'Medium' },
      { key: 'long', label: 'Long' },
    ],
    []
  );

  const toneOptions: { key: ToneOption; label: string }[] = useMemo(
    () => [
      { key: 'light', label: 'Light' },
      { key: 'neutral', label: 'Neutral' },
      { key: 'dark', label: 'Dark' },
    ],
    []
  );

  const perspectiveOptions: { key: PerspectiveOption; label: string }[] = useMemo(
    () => [
      { key: 'first', label: 'First Person' },
      { key: 'third', label: 'Third Person' },
      { key: 'omniscient', label: 'Omniscient' },
      { key: 'second', label: 'Second Person' },
    ],
    []
  );

  const difficultyOptions: { key: DifficultyOption; label: string }[] = useMemo(
    () => [
      { key: 'easy', label: 'Easy' },
      { key: 'normal', label: 'Normal' },
      { key: 'hard', label: 'Hard' },
    ],
    []
  );

  const onContinue = () => {
    if (!length) return;
    router.push({ pathname: '/character', params: { genre, length, tone, perspective, difficulty } });
  };

  const SectionLabel = ({ text }: { text: string }) => (
    <Text style={styles.sectionLabel}>{text}</Text>
  );

  const Option = ({
    label,
    active,
    onPress,
  }: {
    label: string;
    active: boolean;
    onPress: () => void;
  }) => (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={[
        styles.option,
        active && styles.optionActive,
        active && { transform: [{ scale: 1.03 }] }
      ]}
    >
      <Text style={styles.optionText}>{label}</Text>
    </TouchableOpacity>
  );

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
          <Text style={styles.heading}>Customize your story</Text>
          <Text style={styles.subheading}>Choose your preferences to create the perfect story</Text>
        </Animated.View>

        <Animated.View style={[styles.sections, { opacity: sectionsOpacity }] }>
          <SectionLabel text="STORY LENGTH" />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalRow}
          >
            {lengthOptions.map((opt) => (
              <Option
                key={opt.key}
                label={opt.label}
                active={length === opt.key}
                onPress={() => setLength(opt.key)}
              />
            ))}
          </ScrollView>

          <View style={{ height: 26 }} />
          <SectionLabel text="TONE" />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalRow}
          >
            {toneOptions.map((opt) => (
              <Option
                key={opt.key}
                label={opt.label}
                active={tone === opt.key}
                onPress={() => setTone(opt.key)}
              />
            ))}
          </ScrollView>

          <View style={{ height: 26 }} />
          <SectionLabel text="PERSPECTIVE" />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalRow}
          >
            {perspectiveOptions.map((opt) => (
              <Option
                key={opt.key}
                label={opt.label}
                active={perspective === opt.key}
                onPress={() => setPerspective(opt.key)}
              />
            ))}
          </ScrollView>

          <View style={{ height: 26 }} />
          <SectionLabel text="DIFFICULTY" />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalRow}
          >
            {difficultyOptions.map((opt) => (
              <Option
                key={opt.key}
                label={opt.label}
                active={difficulty === opt.key}
                onPress={() => setDifficulty(opt.key)}
              />
            ))}
          </ScrollView>
        </Animated.View>
      </ScrollView>

      <Animated.View style={[styles.ctaWrapper, { opacity: buttonOpacity }]}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={onContinue}
          disabled={!length}
          style={[styles.cta, !length && styles.ctaDisabled]}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    paddingTop: 90,
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  heading: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: '700',
    textAlign: 'center',
    fontFamily: Fonts.rounded,
    paddingHorizontal: 40,
  },
  subheading: {
    color: '#A9B0C6',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 40,
  },
  sections: {
    marginTop: 38,
  },
  sectionLabel: {
    color: '#A9B0C6',
    fontSize: 16,
    letterSpacing: 2,
    marginBottom: 12,
    marginLeft: 20,
    fontFamily: Fonts.sans,
  },
  rowWrap: {
    flexDirection: 'row',
    // no wrap when using horizontal ScrollView
  },
  horizontalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  option: {
    paddingVertical: 16,
    paddingHorizontal: 22,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(255,255,255,0.04)',
    marginRight: 12,
    marginBottom: 12,
  },
  optionActive: {
    borderWidth: 3,
    borderColor: '#7B68EE',
    shadowColor: '#7B68EE',
    shadowOpacity: 0.7,
    shadowRadius: 10,
    elevation: 6,
  },
  optionText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    fontFamily: Fonts.sans,
  },
  ctaWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 36,
    paddingHorizontal: 20,
  },
  cta: {
    height: 64,
    borderRadius: 32,
    overflow: 'hidden',
  },
  ctaDisabled: {
    opacity: 0.5,
  },
  ctaGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
  },
});


