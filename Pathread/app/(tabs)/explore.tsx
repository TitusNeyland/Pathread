import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function ExploreScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.content}>
        <ThemedText type="title" style={styles.title}>
          Explore Stories
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Discover and explore amazing stories
        </ThemedText>
        <ThemedText style={styles.description}>
          Browse through a collection of stories and find inspiration for your own creations.
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    marginBottom: 12,
    textAlign: 'center',
    opacity: 0.8,
  },
  description: {
    textAlign: 'center',
    opacity: 0.6,
    lineHeight: 24,
  },
});