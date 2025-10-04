import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  bgGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  header: {
    alignItems: 'center',
    marginTop: 0,
    marginBottom: 24,
  },
  title: {
    color: '#ffffff',
    fontSize: 56,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'lowercase',
  },
  subtitle: {
    color: '#9aa0a6',
    marginTop: 8,
    fontSize: 16,
  },
   card: {
     width: '90%',
     backgroundColor: 'rgba(15,15,18,0.8)',
     borderRadius: 20,
     padding: 18,
     shadowColor: '#000',
     shadowOpacity: 0.4,
     shadowRadius: 20,
     shadowOffset: { width: 0, height: 10 },
     elevation: 16,
     borderWidth: 1,
     borderColor: 'rgba(120,130,150,0.3)',
   },
  fieldGroup: {
    marginBottom: 16,
  },
  label: {
    color: '#e7e8ea',
    marginBottom: 8,
    fontWeight: '600',
    fontSize: 20,
  },
  inputWrapper: {
    position: 'relative',
  },
  input: {
    borderWidth: 1,
    borderColor: '#262b35',
    backgroundColor: '#0f1115',
    color: '#ffffff',
    paddingHorizontal: 16,
    height: 56,
    borderRadius: 14,
  },
  inputIcon: {
    position: 'absolute',
    right: 12,
    top: 16,
    height: 24,
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    marginTop: 12,
    borderRadius: 14,
    overflow: 'hidden',
  },
  buttonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 14,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 18,
  },
  footerText: {
    color: '#9aa0a6',
    textAlign: 'center',
    marginTop: 12,
  },
   link: {
     color: '#4A90E2',
     fontWeight: '700',
   },
  bottomHint: {
    color: '#8f9399',
    marginTop: 18,
    fontSize: 16,
  },
});
