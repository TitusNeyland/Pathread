// Configuration constants for the app
export const CONFIG = {
  // OpenAI API configuration
  OPENAI: {
    // Replace with your actual OpenAI API key
    API_KEY: process.env.EXPO_PUBLIC_OPENAI_API_KEY || 'REDACTED',
    MODEL: process.env.EXPO_PUBLIC_OPENAI_MODEL || 'gpt-4', // GPT-4 for better story quality
    MAX_TOKENS: parseInt(process.env.EXPO_PUBLIC_OPENAI_MAX_TOKENS || '1500'),
    TEMPERATURE: 0.8,
  },
  
  // Story generation settings
  STORY: {
    DEFAULT_LENGTH: 'medium', // short, medium, long
    DEFAULT_TONE: 'engaging', // engaging, mysterious, romantic, etc.
    DEFAULT_GENRE: 'fantasy', // fantasy, sci-fi, romance, mystery, etc.
  },
  
  // App settings
  APP: {
    LOADING_TIMEOUT: 30000, // 30 seconds timeout for story generation
    MAX_RETRIES: 3,
  },
} as const;

// Environment variables that should be set
export const REQUIRED_ENV_VARS = [
  'EXPO_PUBLIC_OPENAI_API_KEY',
] as const;
