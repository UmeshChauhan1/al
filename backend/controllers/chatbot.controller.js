const DEFAULT_MODEL = process.env.GEMINI_MODEL || 'gemini-1.5-flash';

function buildGeminiUrl(model, apiKey) {
  return `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
}

function getFallbackReply(userMessage = '') {
  const text = String(userMessage || '').toLowerCase();

  if (text.includes('job')) {
    return 'You can explore openings in Jobs. Go to Jobs from the top menu, then filter by skills, location, and experience level.';
  }
  if (text.includes('mentor')) {
    return 'Mentorship is available in the Mentorship section. You can browse mentors, request sessions, and track progress there.';
  }
  if (text.includes('forum')) {
    return 'Use Forums to ask questions and share updates with alumni and students. You can create a topic and reply to discussions.';
  }
  if (text.includes('event')) {
    return 'Check Events for upcoming reunions, workshops, and webinars. You can view details and RSVP from the Events pages.';
  }

  return 'I am temporarily rate-limited by the AI provider. Please try again in a minute, or ask about Jobs, Mentorship, Forums, or Events for quick guidance.';
}

const SYSTEM_PROMPT = `You are a helpful AI assistant for the Alumni Management System.
Keep answers concise, practical, and friendly.
When users ask about features, explain where to find them in the app.
If you are unsure, suggest using the Contact page.`;

async function chatWithGemini(req, res, next) {
  try {
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: 'Chatbot is not configured. Add GEMINI_API_KEY in backend/.env.'
      });
    }

    const { userMessage, history = [] } = req.body || {};
    if (!userMessage || typeof userMessage !== 'string') {
      return res.status(400).json({ error: 'userMessage is required.' });
    }

    const safeHistory = Array.isArray(history)
      ? history
          .filter((item) => item && typeof item.text === 'string')
          .slice(-20)
      : [];

    const conversation = safeHistory
      .map((msg) => `${msg.type === 'user' ? 'User' : 'Assistant'}: ${msg.text}`)
      .join('\n');

    const prompt = `${SYSTEM_PROMPT}\n\nConversation History:\n${conversation}\n\nUser: ${userMessage}\nAssistant:`;

    const modelsToTry = [
      DEFAULT_MODEL,
      'gemini-2.0-flash',
      'gemini-1.5-flash'
    ].filter((value, index, list) => value && list.indexOf(value) === index);

    let lastErrorMessage = 'Failed to get response from Gemini.';
    let lastStatus = 500;
    let sawProviderRateLimit = false;

    for (const model of modelsToTry) {
      const response = await fetch(buildGeminiUrl(model, apiKey), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 500
          }
        })
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        const reply =
          data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
          'I could not generate a response right now. Please try again.';

        return res.json({ reply });
      }

      lastStatus = response.status;
      lastErrorMessage = data?.error?.message || lastErrorMessage;

      // Try next model for common provider-side transient/model issues.
      if (response.status === 429 || response.status === 503) {
        sawProviderRateLimit = true;
      }

      if (response.status === 429 || response.status === 503 || response.status === 404) {
        continue;
      }

      return res.status(response.status).json({
        error: lastErrorMessage
      });
    }

    // If all model attempts fail, return a graceful fallback so chat remains usable.
    if (lastStatus === 429 || lastStatus === 503 || sawProviderRateLimit) {
      return res.json({
        reply: getFallbackReply(userMessage),
        providerLimited: true
      });
    }

    return res.status(lastStatus).json({ error: lastErrorMessage });
  } catch (err) {
    return next(err);
  }
}

module.exports = { chatWithGemini };
