import admin from 'firebase-admin';
import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';
import { onRequest } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params';

admin.initializeApp();

const OPENAI_API_KEY = defineSecret('OPENAI_API_KEY');

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

app.post('/generateStory', async (req, res) => {
  try {
    const { hookId, genre, length, tone, perspective, difficulty, hookDescription } = req.body || {};
    if (!hookId) return res.status(400).json({ error: 'hookId required' });

    const prompt = buildPrompt({ hookId, genre, length, tone, perspective, difficulty, hookDescription });

    const client = new OpenAI({ apiKey: OPENAI_API_KEY.value() || process.env.OPENAI_API_KEY });
    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a vivid, tasteful fiction writer. Keep it PG-13.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.85,
      max_tokens: 900,
    });

    const story = completion.choices?.[0]?.message?.content || '';
    return res.json({ story });
  } catch (err) {
    console.error(err);
    return res.status(500).send(typeof err?.message === 'string' ? err.message : 'Internal error');
  }
});

app.post('/generateCharacterBio', async (req, res) => {
  try {
    const { firstName, zodiacSign, interests } = req.body || {};
    if (!firstName || !zodiacSign || !interests) {
      return res.status(400).json({ error: 'firstName, zodiacSign, and interests are required' });
    }

    const prompt = buildCharacterBioPrompt({ firstName, zodiacSign, interests });

    const client = new OpenAI({ apiKey: OPENAI_API_KEY.value() || process.env.OPENAI_API_KEY });
    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a creative character designer who creates unique, personalized character bios for a fantasy storytelling app. Keep content PG-13 and inspiring.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.8,
      max_tokens: 800,
    });

    const bioContent = completion.choices?.[0]?.message?.content || '';
    
    // Parse the AI response to extract structured data
    const characterBio = parseCharacterBioResponse(bioContent, firstName, zodiacSign);
    
    return res.json({ characterBio });
  } catch (err) {
    console.error(err);
    return res.status(500).send(typeof err?.message === 'string' ? err.message : 'Internal error');
  }
});

app.post('/generateStoryHooks', async (req, res) => {
  try {
    const { genre } = req.body || {};
    if (!genre) {
      return res.status(400).json({ error: 'genre is required' });
    }

    const prompt = buildStoryHooksPrompt(genre);

    const client = new OpenAI({ apiKey: OPENAI_API_KEY.value() || process.env.OPENAI_API_KEY });
    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a creative storyteller who creates compelling story hooks for different genres. Keep content PG-13 and engaging.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.9,
      max_tokens: 600,
    });

    const hooksContent = completion.choices?.[0]?.message?.content || '';
    
    // Parse the AI response to extract structured data
    const storyHooks = parseStoryHooksResponse(hooksContent, genre);
    
    return res.json({ storyHooks });
  } catch (err) {
    console.error(err);
    return res.status(500).send(typeof err?.message === 'string' ? err.message : 'Internal error');
  }
});

function buildPrompt({ hookId, genre, length, tone, perspective, difficulty, hookDescription }) {
  // Use the provided hook description if available, otherwise fall back to hardcoded hooks
  const hookMap = {
    'moonlight-pact': 'On the eve of a blood moon, a pact binds the narrator to a hidden realm.',
    'echoes-tomorrow': 'A message from the future warns the narrator of a pivotal choice.',
    'silent-city': 'Everyone vanishes overnight; the narrator wanders an eerily silent city.',
  };
  
  const hook = hookDescription || hookMap[hookId] || 'A compelling mysterious opening.';

  const desiredLength =
    length === 'short' ? 'about 400-600 words' : length === 'long' ? 'about 900-1200 words' : 'about 700-900 words';

  const style = [
    genre ? `genre: ${genre}` : null,
    tone ? `tone: ${tone}` : null,
    perspective ? `narrative perspective: ${perspective}` : null,
    difficulty ? `reading level: ${difficulty}` : null,
  ]
    .filter(Boolean)
    .join(', ');

  return `Write an original short story ${desiredLength}.
Opening hook: ${hook}
Style constraints: ${style || 'your best crowd-pleasing style'}
Avoid graphic content; keep it suitable for teens. Use clear paragraphs.`;
}

function buildCharacterBioPrompt({ firstName, zodiacSign, interests }) {
  const zodiacDescriptions = {
    'Aries': 'bold, pioneering, and natural leaders with fiery determination',
    'Taurus': 'grounded, patient, and appreciative of life\'s simple pleasures',
    'Gemini': 'curious, adaptable, and gifted with communication and wit',
    'Cancer': 'intuitive, nurturing, and deeply connected to emotions and home',
    'Leo': 'confident, creative, and natural performers with generous hearts',
    'Virgo': 'analytical, practical, and dedicated to helping others improve',
    'Libra': 'diplomatic, artistic, and seekers of balance and harmony',
    'Scorpio': 'intense, transformative, and drawn to life\'s deeper mysteries',
    'Sagittarius': 'adventurous, philosophical, and eternal seekers of knowledge',
    'Capricorn': 'ambitious, disciplined, and builders of lasting legacies',
    'Aquarius': 'innovative, humanitarian, and visionaries of the future',
    'Pisces': 'compassionate, imaginative, and bridges between reality and dreams'
  };

  const zodiacTraits = zodiacDescriptions[zodiacSign] || 'unique and special';
  const interestsList = Array.isArray(interests) ? interests.join(', ') : interests;

  return `Create a realistic character bio for someone named ${firstName}.

Character Details:
- Name: ${firstName}
- Zodiac Sign: ${zodiacSign} (${zodiacTraits})
- Interests: ${interestsList}

Please create a character bio in the following JSON format:
{
  "name": "${firstName}",
  "title": "A professional or personal title that reflects their zodiac sign and personality",
  "description": "A 2-3 sentence description that weaves together their zodiac traits and interests in a realistic, everyday context",
  "tags": ["3", "relevant", "personality tags"],
  "backstory": "A 3-4 sentence backstory that explains how their zodiac traits and interests shaped their character and life experiences in a realistic way"
}

Make it feel authentic and relatable, incorporating their zodiac sign's characteristics and their interests into a cohesive, realistic character. Focus on real-world personality traits, career paths, or life experiences that someone with these characteristics might have. Avoid fantasy or mystical elements.`;
}

function buildStoryHooksPrompt(genre) {
  const genreDescriptions = {
    'horror': 'dark, suspenseful, and atmospheric with elements of fear and mystery',
    'romance': 'heartwarming, emotional, and focused on relationships and love',
    'scifi': 'futuristic, technological, and exploring scientific concepts',
    'fantasy': 'magical, mystical, and set in otherworldly realms',
    'mystery': 'puzzling, investigative, and focused on solving secrets',
    'adventure': 'exciting, action-packed, and full of exploration',
    'comedy': 'humorous, light-hearted, and entertaining',
    'mythology': 'ancient, legendary, and based on myths and folklore',
    'history': 'historical, period-based, and grounded in real events',
    'thriller': 'suspenseful, intense, and keeping readers on edge',
    'drama': 'emotional, character-driven, and realistic',
    'action': 'fast-paced, exciting, and full of physical conflict',
    'supernatural': 'otherworldly, mysterious, and involving paranormal elements',
    'western': 'frontier-based, rugged, and set in the American West',
    'steampunk': 'Victorian-era technology, steam-powered, and retro-futuristic',
    'detective': 'investigative, crime-solving, and mystery-focused',
    'romantic': 'love-focused, emotional, and relationship-driven',
    'space': 'cosmic, interstellar, and set in outer space',
    'magic': 'magical, mystical, and involving supernatural powers',
    'suspense': 'tense, uncertain, and building anticipation',
    'exploration': 'discovery-focused, adventurous, and about finding new places',
    'humor': 'funny, entertaining, and light-hearted',
    'legends': 'mythical, legendary, and based on traditional stories',
    'historical': 'period-based, authentic, and grounded in history',
    'psychological': 'mind-focused, complex, and exploring mental states'
  };

  const genreDescription = genreDescriptions[genre] || 'engaging and compelling';

  return `Create 3 unique story hooks for a ${genre} story. Each hook should be ${genreDescription}.

Please create the story hooks in the following JSON format:
{
  "hooks": [
    {
      "id": "unique-id-1",
      "title": "Compelling Title",
      "description": "A 1-2 sentence description that sets up an intriguing scenario and makes the reader want to know what happens next"
    },
    {
      "id": "unique-id-2", 
      "title": "Another Compelling Title",
      "description": "A 1-2 sentence description that creates mystery, tension, or curiosity"
    },
    {
      "id": "unique-id-3",
      "title": "Third Compelling Title", 
      "description": "A 1-2 sentence description that hooks the reader with an interesting premise"
    }
  ]
}

Make each hook unique and engaging. Focus on creating scenarios that immediately draw the reader in and make them curious about what happens next. Each hook should feel like the beginning of an exciting story.`;
}

function parseStoryHooksResponse(hooksContent, genre) {
  try {
    // Try to extract JSON from the response
    const jsonMatch = hooksContent.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (parsed.hooks && Array.isArray(parsed.hooks)) {
        return parsed.hooks.map((hook, index) => ({
          id: hook.id || `generated-hook-${index + 1}`,
          title: hook.title || `Untitled ${genre} Story`,
          description: hook.description || 'An intriguing story awaits...'
        }));
      }
    }
  } catch (error) {
    console.error('Error parsing story hooks response:', error);
  }

  // Fallback if JSON parsing fails
  return [
    {
      id: 'fallback-hook-1',
      title: `Mysterious ${genre.charAt(0).toUpperCase() + genre.slice(1)} Beginning`,
      description: `Something unexpected happens that changes everything in this ${genre} story.`
    },
    {
      id: 'fallback-hook-2',
      title: `The ${genre.charAt(0).toUpperCase() + genre.slice(1)} Discovery`,
      description: `A discovery is made that opens up new possibilities in this ${genre} tale.`
    },
    {
      id: 'fallback-hook-3',
      title: `Unexpected ${genre.charAt(0).toUpperCase() + genre.slice(1)} Twist`,
      description: `An unexpected turn of events sets the stage for this ${genre} adventure.`
    }
  ];
}

function parseCharacterBioResponse(bioContent, firstName, zodiacSign) {
  try {
    // Try to extract JSON from the response
    const jsonMatch = bioContent.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        name: parsed.name || firstName,
        title: parsed.title || 'Wanderer',
        description: parsed.description || 'A mysterious traveler seeking adventure.',
        tags: parsed.tags || ['Adventurous', 'Mysterious', 'Unique'],
        backstory: parsed.backstory || 'Born under the stars, this character has always felt drawn to explore the unknown.'
      };
    }
  } catch (error) {
    console.error('Error parsing AI response:', error);
  }

  // Fallback if JSON parsing fails
  return {
    name: firstName,
    title: 'The Unique Individual',
    description: `As a ${zodiacSign}, ${firstName} brings their natural personality traits to everything they do. They approach life with authenticity and enthusiasm.`,
    tags: ['Authentic', 'Genuine', 'Unique'],
    backstory: `${firstName} has always been known for their ${zodiacSign.toLowerCase()} nature, bringing their unique perspective to their interests and experiences. Their journey has been shaped by their natural personality traits and the meaningful connections they've made along the way.`
  };
}

export const api = onRequest({ region: 'us-central1', secrets: [OPENAI_API_KEY] }, app);

