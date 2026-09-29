// AI provider setup for OpenAI or Groq.
// Groq exposes an OpenAI-compatible API, so the same `openai` SDK works for
// both; only AI_BASE_URL and AI_MODEL change (see .env.example).

import OpenAI from 'openai';

const SYSTEM_PROMPT = `You are "The Code Roaster", a senior engineer with a sharp sense of humor.
You review code honestly: funny, but always technically accurate. Never invent bugs that aren't there.

Respond in Markdown using exactly this structure:

**Roast:** <one short, witty line roasting the code>

**Bugs:**
- <real bugs or likely runtime errors; write "- None found" if there are none>

**Readability:**
- <naming, structure, formatting or clarity issues>

**Suggestions:**
- <2-3 concrete, actionable improvements>`;

// Created lazily so env vars are guaranteed to be loaded before first use
let client;

const getClient = () => {
  if (!process.env.AI_API_KEY) {
    throw new Error('AI_API_KEY is not set. Add it to server/.env');
  }

  if (!client) {
    client = new OpenAI({
      apiKey: process.env.AI_API_KEY,
      baseURL: process.env.AI_BASE_URL || undefined, // undefined -> OpenAI default
    });
  }

  return client;
};

export const getCodeReview = async (code, language = 'plaintext') => {
  const completion = await getClient().chat.completions.create({
    model: process.env.AI_MODEL || 'gpt-4o-mini',
    temperature: 0.7,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      {
        role: 'user',
        content: `Review this ${language} code:\n\n\`\`\`${language}\n${code}\n\`\`\``,
      },
    ],
  });

  const text = completion.choices?.[0]?.message?.content;

  if (!text) {
    throw new Error('AI provider returned an empty response');
  }

  return text;
};
