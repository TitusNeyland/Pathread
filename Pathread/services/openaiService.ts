import { CONFIG } from '../constants/config';

export interface StoryGenerationParams {
  genre?: string;
  length?: string;
  tone?: string;
  perspective?: string;
  difficulty?: string;
  storyId?: string;
  userPreferences?: {
    name?: string;
    interests?: string[];
    birthday?: string;
  };
  // AI Dungeon-style parameters
  previousContent?: string;
  userAction?: string;
  storyContext?: string;
  isFirstGeneration?: boolean;
}

export interface StoryResponse {
  content: string;
  title: string;
  chapter: number;
  totalChapters?: number;
  choices?: string[];
  // AI Dungeon-style response
  actionPrompt?: string;
  storyState?: string;
  characterInfo?: string;
  worldInfo?: string;
}

class OpenAIService {
  private apiKey: string;
  private baseURL = 'https://api.openai.com/v1/chat/completions';

  constructor() {
    this.apiKey = CONFIG.OPENAI.API_KEY;
    
    console.log('OpenAI Service initialized with API key:', this.apiKey ? `${this.apiKey.substring(0, 10)}...` : 'NOT SET');
    
    if (!this.apiKey || this.apiKey === 'your-openai-api-key-here') {
      console.warn('OpenAI API key not configured. Please set EXPO_PUBLIC_OPENAI_API_KEY in your environment variables.');
    }
  }

  private async makeRequest(prompt: string): Promise<string> {
    if (!this.apiKey || this.apiKey === 'your-openai-api-key-here') {
      throw new Error('OpenAI API key not configured');
    }

    console.log('Making OpenAI API request with model:', CONFIG.OPENAI.MODEL);
    console.log('Prompt length:', prompt.length);

    try {
      const requestBody = {
        model: CONFIG.OPENAI.MODEL,
        messages: [
          {
            role: 'system',
            content: 'You are a creative story writer. Generate engaging, interactive stories based on user preferences. Always respond with valid JSON format.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: CONFIG.OPENAI.MAX_TOKENS,
        temperature: CONFIG.OPENAI.TEMPERATURE,
      };

      console.log('Request body:', JSON.stringify(requestBody, null, 2));

      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(requestBody),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`OpenAI API error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      console.log('API Response data:', data);
      return data.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('OpenAI API request failed:', error);
      throw error;
    }
  }

  private buildStoryPrompt(params: StoryGenerationParams): string {
    const {
      genre = CONFIG.STORY.DEFAULT_GENRE,
      length = CONFIG.STORY.DEFAULT_LENGTH,
      tone = CONFIG.STORY.DEFAULT_TONE,
      perspective = 'second-person',
      difficulty = 'intermediate',
      storyId,
      userPreferences,
      previousContent,
      userAction,
      storyContext,
      isFirstGeneration = true,
    } = params;

    if (isFirstGeneration) {
      return this.buildInitialStoryPrompt(params);
    } else {
      return this.buildContinuationPrompt(params);
    }
  }

  private buildInitialStoryPrompt(params: StoryGenerationParams): string {
    const {
      genre = CONFIG.STORY.DEFAULT_GENRE,
      length = CONFIG.STORY.DEFAULT_LENGTH,
      tone = CONFIG.STORY.DEFAULT_TONE,
      perspective = 'second-person',
      difficulty = 'intermediate',
      storyId,
      userPreferences,
    } = params;

    // AI Dungeon-style story prompts
    const storyPrompts: Record<string, string> = {
      'moonlight-pact': `You are a master storyteller creating an interactive ${genre} adventure. The story begins with the protagonist discovering a mysterious secret on the eve of a blood moon that could bind them to a world beyond their own.`,
      'echoes-tomorrow': `You are a master storyteller creating an interactive ${genre} adventure. The story begins with the protagonist receiving a warning from a voice claiming to be from the future about a choice that will change everything.`,
      'silent-city': `You are a master storyteller creating an interactive ${genre} adventure. The story begins with the protagonist waking up to find that everyone in their city has vanished overnight, and the empty streets seem to be waiting for something.`,
    };

    let systemPrompt = storyPrompts[storyId || ''] || `You are a master storyteller creating an interactive ${genre} adventure.`;

    // Add user preferences
    if (userPreferences?.name) {
      systemPrompt += ` The protagonist's name is ${userPreferences.name}.`;
    }

    if (userPreferences?.interests && userPreferences.interests.length > 0) {
      systemPrompt += ` The story should incorporate themes related to: ${userPreferences.interests.join(', ')}.`;
    }

    const userPrompt = `Create the opening scene of this interactive story. 

STORY RULES:
- Write in ${perspective} perspective ("You are...", "You see...", etc.)
- Tone: ${tone}
- Length: ${length} (2-3 paragraphs for opening)
- Difficulty: ${difficulty}
- Make it immersive and engaging
- End with a situation that requires the protagonist to make a choice
- Provide 3 interesting action choices

FORMAT: Return JSON with this structure:
{
  "title": "Story Title",
  "content": "The opening story content...",
  "chapter": 1,
  "choices": ["Action 1", "Action 2", "Action 3"],
  "actionPrompt": "What do you do?",
  "storyState": "Brief description of current situation",
  "characterInfo": "Brief character description",
  "worldInfo": "Brief world/setting description"
}`;

    return `${systemPrompt}\n\n${userPrompt}`;
  }

  private buildContinuationPrompt(params: StoryGenerationParams): string {
    const {
      previousContent,
      userAction,
      storyContext,
      genre = CONFIG.STORY.DEFAULT_GENRE,
      tone = CONFIG.STORY.DEFAULT_TONE,
    } = params;

    const systemPrompt = `You are continuing an interactive ${genre} story. You must:
1. Continue the story based on the user's action
2. Maintain consistency with previous events
3. Keep the ${tone} tone
4. Create consequences and new situations
5. End with new choices for the user

STORY CONTEXT:
${storyContext || 'No previous context'}

PREVIOUS CONTENT:
${previousContent || 'No previous content'}

USER'S ACTION:
${userAction || 'No action specified'}

Continue the story by describing what happens as a result of the user's action. Make it engaging and create new challenges or opportunities. End with 3 new action choices.

FORMAT: Return JSON with this structure:
{
  "content": "The continuation of the story...",
  "choices": ["New Action 1", "New Action 2", "New Action 3"],
  "actionPrompt": "What do you do next?",
  "storyState": "Updated situation description",
  "characterInfo": "Updated character info if changed",
  "worldInfo": "Updated world info if changed"
}`;

    return systemPrompt;
  }

  async generateStory(params: StoryGenerationParams): Promise<StoryResponse> {
    try {
      const prompt = this.buildStoryPrompt(params);
      const response = await this.makeRequest(prompt);
      
      // Try to parse the JSON response
      let storyData: StoryResponse;
      try {
        storyData = JSON.parse(response);
      } catch (parseError) {
        // If JSON parsing fails, create a fallback response
        console.warn('Failed to parse OpenAI response as JSON, using fallback');
        storyData = {
          title: 'Generated Story',
          content: response,
          chapter: 1,
          choices: ['Continue the story', 'Explore further', 'Make a different choice'],
        };
      }

      return storyData;
    } catch (error) {
      console.error('Story generation failed:', error);
      
      // Return a fallback story in case of API failure
      return {
        title: 'Adventure Awaits',
        content: 'You find yourself at the beginning of an incredible journey. The path ahead is uncertain, but filled with endless possibilities. What will you choose to do next?',
        chapter: 1,
        choices: ['Take the left path', 'Go straight ahead', 'Turn back'],
      };
    }
  }

  // AI Dungeon-style story continuation
  async continueStory(params: StoryGenerationParams): Promise<StoryResponse> {
    try {
      const continuationParams = {
        ...params,
        isFirstGeneration: false,
      };
      
      const prompt = this.buildStoryPrompt(continuationParams);
      const response = await this.makeRequest(prompt);
      
      // Try to parse the JSON response
      let storyData: StoryResponse;
      try {
        storyData = JSON.parse(response);
      } catch (parseError) {
        console.warn('Failed to parse OpenAI response as JSON, using fallback');
        storyData = {
          title: 'Story Continuation',
          content: response,
          chapter: 1,
          choices: ['Continue exploring', 'Try something else', 'Look around more'],
          actionPrompt: 'What do you do next?',
          storyState: 'The story continues...',
        };
      }

      return storyData;
    } catch (error) {
      console.error('Story continuation failed:', error);
      
      // Return a fallback continuation
      return {
        title: 'Story Continuation',
        content: 'The story continues with new possibilities unfolding before you. What will you choose to do next?',
        chapter: 1,
        choices: ['Explore further', 'Take a different approach', 'Reflect on the situation'],
        actionPrompt: 'What do you do next?',
        storyState: 'The adventure continues...',
      };
    }
  }

  // Method to check if API key is configured
  isConfigured(): boolean {
    return !!(this.apiKey && this.apiKey !== 'your-openai-api-key-here');
  }
}

// Export a singleton instance
export const openaiService = new OpenAIService();
