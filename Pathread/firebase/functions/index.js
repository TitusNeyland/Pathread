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
    const { hookId, genre, length, tone, perspective, difficulty } = req.body || {};
    if (!hookId) return res.status(400).json({ error: 'hookId required' });

    const prompt = buildPrompt({ hookId, genre, length, tone, perspective, difficulty });

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

function buildPrompt({ hookId, genre, length, tone, perspective, difficulty }) {
  const hookMap = {
    'moonlight-pact': 'On the eve of a blood moon, a pact binds the narrator to a hidden realm.',
    'echoes-tomorrow': 'A message from the future warns the narrator of a pivotal choice.',
    'silent-city': 'Everyone vanishes overnight; the narrator wanders an eerily silent city.',
  };
  const hook = hookMap[hookId] || 'A compelling mysterious opening.';

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

export const api = onRequest({ region: 'us-central1', secrets: [OPENAI_API_KEY] }, app);

