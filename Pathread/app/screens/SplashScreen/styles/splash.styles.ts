import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
  },
  title: {
    color: '#ffffff',
    fontSize: 40,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'lowercase',
  },
  footer: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    textAlign: 'center',
    color: '#9BA1A6',
    opacity: 0.8,
    fontSize: 12,
  },
});
