import { StyleSheet } from 'react-native';
import { Fonts } from '@/constants/theme';

export const storyTypeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B1020',
    paddingTop: 100,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20, // Reduced space for the fixed Continue button
  },
  heading: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: '800',
    textAlign: 'center',
  },
  subheading: {
    color: '#A9B0C6',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 32,
  },
  grid: {
    paddingBottom: 24,
  },
  gridRow: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  carouselWrapper: {
    position: 'relative',
    marginBottom: 12,
  },
  carouselRow: {
    paddingBottom: 12,
  },
  carouselItem: {
    width: 150,
    marginRight: 12,
  },
  cardWrapper: {
    borderRadius: 18,
    marginVertical: 6,
  },
  cardWrapperActive: {
    borderWidth: 3,
    borderColor: '#7B68EE',
    shadowColor: '#7B68EE',
    shadowOpacity: 0.7,
    shadowRadius: 10,
    elevation: 6,
  },
  card: {
    width: '100%',
    aspectRatio: 1.05,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#1A2036',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  cardOverlay: {
    ...({} as any), // keep RN StyleSheet happy without importing Platform types
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  cardTitle: {
    position: 'absolute',
    bottom: 14,
    left: 12,
    right: 12,
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
    fontFamily: Fonts.sans,
    textAlign: 'center',
  },
  cta: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 50,
    height: 64,
    borderRadius: 32,
    overflow: 'hidden',
    marginHorizontal: 20,
  },
  ctaDisabled: {
    opacity: 0.5,
  },
  ctaGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 32,
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
  },
  checkmarkContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#7B68EE',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
});


