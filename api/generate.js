export default async function handler(req, res) {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: 'Server misconfigured: missing OPENAI_API_KEY' });
  }

  try {
    const {
      genre,
      length,
      tone,
      perspective,
      difficulty,
      storyId,
      previousContent,
      userAction,
      storyContext,
      isFirstGeneration,
    } = (req.body || {});

    const prompt = buildPrompt({
      genre,
      length,
      tone,
      perspective,
      difficulty,
      storyId,
      previousContent,
      userAction,
      storyContext,
      isFirstGeneration,
    });

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a creative interactive storyteller. Always return valid JSON.' },
          { role: 'user', content: prompt },
        ],
        max_tokens: Number(process.env.OPENAI_MAX_TOKENS || '1200'),
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      return res.status(500).json({ error: 'OpenAI error', detail: text });
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content ?? '';

    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).json(safeParse(content));
  } catch (err) {
    return res.status(500).json({ error: 'Server error', detail: err?.message || String(err) });
  }
}

function buildPrompt(p) {
  const genre = p.genre || 'fantasy';
  const length = p.length || 'medium';
  const tone = p.tone || 'engaging';
  const perspective = p.perspective || 'second-person';
  const difficulty = p.difficulty || 'intermediate';
  const isFirst = p.isFirstGeneration !== false;

  if (isFirst) {
    const seed = p.storyId === 'moonlight-pact'
      ? `The story begins on the eve of a blood moon, where a secret could bind the protagonist to a world beyond their own.`
      : p.storyId === 'echoes-tomorrow'
      ? `A voice from the future warns the protagonist of a choice that will change everything.`
      : p.storyId === 'silent-city'
      ? `Everyone vanished overnight, except the protagonist, and the streets are waiting for something.`
      : `Begin a ${genre} adventure.`;

    return `Create the opening scene as JSON.
Rules:
- Perspective: ${perspective}
- Tone: ${tone}
- Length: ${length} (2-3 paragraphs)
- Difficulty: ${difficulty}
- End with 3 meaningful action choices

Seed: ${seed}

Return JSON:
{
  "title": "Story Title",
  "content": "Story text...",
  "chapter": 1,
  "choices": ["Action 1", "Action 2", "Action 3"],
  "actionPrompt": "What do you do?",
  "storyState": "Where things stand",
  "characterInfo": "Key character info",
  "worldInfo": "Key world info"
}`;
  }

  return `Continue the interactive ${genre} story based on the user's action.
Context:
${p.storyContext || ''}

Previous:
${p.previousContent || ''}

User Action:
${p.userAction || ''}

Rules:
- Keep tone ${tone}
- Maintain continuity
- End with 3 new action choices

Return JSON:
{
  "content": "Continuation...",
  "choices": ["New Action 1", "New Action 2", "New Action 3"],
  "actionPrompt": "What do you do next?",
  "storyState": "Updated state",
  "characterInfo": "Updated if changed",
  "worldInfo": "Updated if changed"
}`;
}

function safeParse(s) {
  try { return JSON.parse(s); }
  catch {
    return {
      title: 'Generated Story',
      content: s,
      chapter: 1,
      choices: ['Continue'],
      actionPrompt: 'What do you do?',
      storyState: 'Narrative continues',
    };
  }
}


