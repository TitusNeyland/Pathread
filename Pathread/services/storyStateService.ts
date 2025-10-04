import { StoryResponse, StoryGenerationParams } from './openaiService';

export interface StoryState {
  id: string;
  title: string;
  currentContent: string;
  fullStory: string[];
  currentChoices: string[];
  actionPrompt: string;
  storyState: string;
  characterInfo: string;
  worldInfo: string;
  chapter: number;
  genre: string;
  tone: string;
  length: string;
  perspective: string;
  difficulty: string;
  userPreferences?: {
    name?: string;
    interests?: string[];
    birthday?: string;
  };
  createdAt: Date;
  lastUpdated: Date;
}

class StoryStateService {
  private stories: Map<string, StoryState> = new Map();

  createNewStory(params: StoryGenerationParams): StoryState {
    const storyId = this.generateStoryId();
    
    const storyState: StoryState = {
      id: storyId,
      title: '',
      currentContent: '',
      fullStory: [],
      currentChoices: [],
      actionPrompt: 'What do you do?',
      storyState: '',
      characterInfo: '',
      worldInfo: '',
      chapter: 1,
      genre: params.genre || 'fantasy',
      tone: params.tone || 'engaging',
      length: params.length || 'medium',
      perspective: params.perspective || 'second-person',
      difficulty: params.difficulty || 'intermediate',
      userPreferences: params.userPreferences,
      createdAt: new Date(),
      lastUpdated: new Date(),
    };

    this.stories.set(storyId, storyState);
    return storyState;
  }

  updateStoryWithResponse(storyId: string, response: StoryResponse): StoryState | null {
    const story = this.stories.get(storyId);
    if (!story) return null;

    // Update story with new response
    story.title = response.title || story.title;
    story.currentContent = response.content;
    story.fullStory.push(response.content);
    story.currentChoices = response.choices || [];
    story.actionPrompt = response.actionPrompt || story.actionPrompt;
    story.storyState = response.storyState || story.storyState;
    story.characterInfo = response.characterInfo || story.characterInfo;
    story.worldInfo = response.worldInfo || story.worldInfo;
    story.chapter = response.chapter || story.chapter;
    story.lastUpdated = new Date();

    this.stories.set(storyId, story);
    return story;
  }

  continueStoryWithAction(storyId: string, userAction: string): StoryState | null {
    const story = this.stories.get(storyId);
    if (!story) return null;

    // Add user action to story history
    story.fullStory.push(`> ${userAction}`);
    story.lastUpdated = new Date();

    this.stories.set(storyId, story);
    return story;
  }

  getStory(storyId: string): StoryState | null {
    return this.stories.get(storyId) || null;
  }

  getAllStories(): StoryState[] {
    return Array.from(this.stories.values()).sort(
      (a, b) => b.lastUpdated.getTime() - a.lastUpdated.getTime()
    );
  }

  deleteStory(storyId: string): boolean {
    return this.stories.delete(storyId);
  }

  getStoryContext(storyId: string): string {
    const story = this.stories.get(storyId);
    if (!story) return '';

    // Build context from recent story content
    const recentContent = story.fullStory.slice(-5); // Last 5 entries
    return recentContent.join('\n\n');
  }

  getStoryForContinuation(storyId: string): StoryGenerationParams | null {
    const story = this.stories.get(storyId);
    if (!story) return null;

    return {
      genre: story.genre,
      tone: story.tone,
      length: story.length,
      perspective: story.perspective,
      difficulty: story.difficulty,
      userPreferences: story.userPreferences,
      previousContent: this.getStoryContext(storyId),
      storyContext: `Title: ${story.title}\nCharacter: ${story.characterInfo}\nWorld: ${story.worldInfo}\nCurrent State: ${story.storyState}`,
      isFirstGeneration: false,
    };
  }

  private generateStoryId(): string {
    return `story_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Export story data for saving/loading
  exportStory(storyId: string): string | null {
    const story = this.stories.get(storyId);
    if (!story) return null;
    
    return JSON.stringify(story, null, 2);
  }

  // Import story data
  importStory(storyData: string): StoryState | null {
    try {
      const story: StoryState = JSON.parse(storyData);
      
      // Validate required fields
      if (!story.id || !story.title) {
        throw new Error('Invalid story data');
      }

      // Convert date strings back to Date objects
      story.createdAt = new Date(story.createdAt);
      story.lastUpdated = new Date(story.lastUpdated);

      this.stories.set(story.id, story);
      return story;
    } catch (error) {
      console.error('Failed to import story:', error);
      return null;
    }
  }
}

// Export a singleton instance
export const storyStateService = new StoryStateService();
