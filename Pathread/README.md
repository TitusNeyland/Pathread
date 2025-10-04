# Pathread - AI Story Generator 📚

This is an [Expo](https://expo.dev) project for an AI-powered interactive story generation app. Users can create personalized stories with different genres, tones, and lengths using OpenAI's GPT models.

## Features

- 🎭 Interactive story selection
- 🤖 AI-powered story generation using OpenAI GPT
- 🎨 Beautiful, animated UI with smooth transitions
- 📱 Cross-platform support (iOS, Android, Web)
- ⚙️ Customizable story parameters (genre, tone, length, etc.)

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure OpenAI API Key

To enable AI story generation, you need to set up your OpenAI API key:

1. Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create a `.env` file in the root directory (copy from `env.example`)
3. Add your API key:

```bash
EXPO_PUBLIC_OPENAI_API_KEY=your-actual-api-key-here
```

**Important:** Never commit your actual API key to version control. The `.env` file should be in your `.gitignore`.

### 3. Start the app

```bash
npx expo start
```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
