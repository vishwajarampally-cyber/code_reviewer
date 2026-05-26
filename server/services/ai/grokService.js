const axios = require('axios');

async function callGrok(prompt) {
  const GROK_API_KEY = process.env.GROK_API_KEY;

  // Auto-detect Groq LPU usage if key prefix matches 'gsk_'
  const isGroqKey = GROK_API_KEY && GROK_API_KEY.startsWith('gsk_');

  // Configure endpoints and models dynamically
  let GROK_MODEL = process.env.GROK_MODEL || 'grok-4';
  let GROK_ENDPOINT = process.env.GROK_ENDPOINT || 'https://api.grok.ai/v1/predict';

  if (isGroqKey) {
    // If endpoint is using grok.ai domain or default xAI, override to Groq chat completions
    if (!process.env.GROK_ENDPOINT || process.env.GROK_ENDPOINT.includes('grok.ai')) {
      GROK_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';
    }
    // Map xAI model name to Groq LLaMA model
    if (GROK_MODEL === 'grok-4' || GROK_MODEL.includes('grok')) {
      GROK_MODEL = 'llama-3.3-70b-versatile';
    }
  }

  if (!GROK_API_KEY) {
    console.warn('GROK_API_KEY not set — returning mock AI response for local testing');
    return {
      summary: 'Professional review: mock response. Basic checks applied.',
      score: 75,
      issues: [
        { severity: 'High', line: 3, problem: 'Potential SQL injection risk due to unparameterized input.', solution: 'Enforce parameterized query parameters.' },
        { severity: 'Medium', line: 10, problem: 'Variable declared but never used in execution context.', solution: 'Remove unused identifiers to improve memory hygiene.' }
      ],
      improvedCode: '// Optimized production implementation\nconsole.log("Clean Code");',
      bestPractices: ['Leverage input validation', 'Incorporate unit testing coverage']
    };
  }

  const isChatCompletions = GROK_ENDPOINT.includes('/chat/completions') || GROK_ENDPOINT.includes('/openai');

  const payload = isChatCompletions ? {
    model: GROK_MODEL,
    messages: [
      {
        role: 'user',
        content: prompt
      }
    ],
    response_format: { type: 'json_object' },
    temperature: 0.1
  } : {
    model: GROK_MODEL,
    input: prompt
  };

  try {
    const resp = await axios.post(GROK_ENDPOINT, payload, {
      headers: {
        Authorization: `Bearer ${GROK_API_KEY}`,
        'Content-Type': 'application/json'
      },
      timeout: 45000
    });

    let text = '';
    if (isChatCompletions) {
      if (resp.data && resp.data.choices && resp.data.choices[0] && resp.data.choices[0].message) {
        text = resp.data.choices[0].message.content;
      } else {
        throw new Error('Unexpected Groq API format: ' + JSON.stringify(resp.data));
      }
    } else {
      text = resp.data && (resp.data.output || resp.data.text || resp.data.result || JSON.stringify(resp.data));
    }

    try {
      return typeof text === 'string' ? JSON.parse(text) : text;
    } catch (err) {
      // If not JSON, attempt to extract JSON substring
      const match = /\{[\s\S]*\}/.exec(typeof text === 'string' ? text : JSON.stringify(text));
      if (match) return JSON.parse(match[0]);
      throw new Error('AI returned non-JSON response: ' + text);
    }
  } catch (err) {
    const errorDetails = err.response ? JSON.stringify(err.response.data) : err.message;
    console.error('AI call failed:', errorDetails);
    throw new Error(`AI review failed: ${errorDetails}`);
  }
}

module.exports = { callGrok };

