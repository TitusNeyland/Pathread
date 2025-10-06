import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

type GeneratePayload = {
  hookId: string;
  hookDescription?: string;
  genre?: string;
  length?: string;
  tone?: string;
  perspective?: string;
  difficulty?: string;
};

async function generateStory(apiBaseUrl: string, payload: GeneratePayload): Promise<string> {
  const response = await fetch(`${apiBaseUrl}/generateStory`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'Failed to generate story');
  }
  const data = await response.json();
  return data.story as string;
}

export default function StoryReaderScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<GeneratePayload>();
  const [story, setStory] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const apiBaseUrl = useMemo(() => 'https://api-tbx2d52hwq-uc.a.run.app', []);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        if (!apiBaseUrl) throw new Error('Missing EXPO_PUBLIC_API_BASE_URL');
        if (!params.hookId) throw new Error('Missing selected story');
        const text = await generateStory(apiBaseUrl, params);
        if (isMounted) setStory(text);
      } catch (e: any) {
        if (isMounted) setError(e?.message || 'Something went wrong');
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [apiBaseUrl, params]);

  return (
    <View style={{ flex: 1, backgroundColor: '#0b0b14' }}>
      <LinearGradient
        colors={["rgba(78, 84, 200, 0.25)", "rgba(143, 148, 251, 0.10)", 'rgba(0,0,0,0.6)']}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={{ ...StyleSheet.absoluteFillObject }}
        pointerEvents="none"
      />
      <View style={{ paddingTop: 56, paddingHorizontal: 20 }}>
        <Text style={{ color: 'white', fontSize: 28, fontWeight: '700' }}>Your Story</Text>
        <Text style={{ color: '#c7c7d4', marginTop: 6 }}>Generated just for you</Text>
      </View>

      {loading && (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color="#7c3aed" />
          <Text style={{ color: '#c7c7d4', marginTop: 12 }}>Spinning words...</Text>
        </View>
      )}

      {!loading && error && (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 }}>
          <Text style={{ color: '#ff9aa2', fontSize: 16, textAlign: 'center' }}>{error}</Text>
          <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 16 }}>
            <Text style={{ color: '#7c3aed' }}>Go back</Text>
          </TouchableOpacity>
        </View>
      )}

      {!loading && !error && (
        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
          <Text style={{ color: '#e5e7eb', fontSize: 16, lineHeight: 24 }}>{story}</Text>
        </ScrollView>
      )}
    </View>
  );
}

import { StyleSheet } from 'react-native';

