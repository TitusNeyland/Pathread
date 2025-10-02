import { StyleSheet } from 'react-native';
import { Fonts } from '@/constants/theme';

export const toneLengthStyles = StyleSheet.create({
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
