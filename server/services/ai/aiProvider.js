const grokService = require('./grokService');

async function reviewCode(prompt) {
  const provider = process.env.AI_PROVIDER || 'grok';
  if (provider === 'grok') {
    return await grokService.callGrok(prompt);
  }
  // Placeholder for other providers - implementations can be added later
  throw new Error(`AI provider ${provider} is not implemented`);
}

module.exports = { reviewCode };
