# API Key Setup Guide

## 1. Get Your OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy the key (it starts with `sk-`)

## 2. Configure the API Key

### Option A: Environment Variable (Recommended)
Create a `.env` file in the root directory (`Pathread/`) with:

```bash
EXPO_PUBLIC_OPENAI_API_KEY=your-openai-api-key-here
```

### Option B: Direct Configuration
Edit `constants/config.ts` and ensure it uses the environment variable, not a hardcoded key:
```typescript
API_KEY: process.env.EXPO_PUBLIC_OPENAI_API_KEY || 'your-openai-api-key-here'
```

## 3. Restart the App
After setting up the API key, restart your Expo development server:
```bash
npx expo start --clear
```

## 4. Test the Configuration
The app will automatically detect if the API key is configured and show appropriate messages in the loading screen.

## Security Notes
- Never commit your actual API key to version control
- The `.env` file is already in `.gitignore`
- Consider using environment variables in production
