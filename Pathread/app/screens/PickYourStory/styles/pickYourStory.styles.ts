import { StyleSheet } from 'react-native';
import { Fonts } from '@/constants/theme';

export const pickYourStoryStyles = StyleSheet.create({
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
    paddingHorizontal: 20,
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
    marginBottom: 40,
    paddingHorizontal: 40,
  },
  storiesContainer: {
    gap: 16,
  },
  storyCard: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 100,
    marginHorizontal: 8,
  },
  storyCardActive: {
    borderWidth: 2,
    borderColor: '#7B68EE',
    shadowColor: '#7B68EE',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  thumbnail: {
    width: 100,
    height: 100,
    borderRadius: 12,
    marginRight: 16,
  },
  storyContent: {
    flex: 1,
  },
  storyTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    fontFamily: Fonts.sans,
    marginBottom: 4,
  },
  storyDescription: {
    color: '#A9B0C6',
    fontSize: 14,
    lineHeight: 20,
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
