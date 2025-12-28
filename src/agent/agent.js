// Agent that orchestrates local memory + API calls + post-processing
const axios = require('axios');
const fs = require('fs');
const path = require('path');

function loadConfig() {
  const cfgPath = path.join(process.cwd(), 'config', 'local.json');
  if (!fs.existsSync(cfgPath)) throw new Error('Local config missing. Create config/local.json');
  return JSON.parse(fs.readFileSync(cfgPath, 'utf-8'));
}

// Compose a structured prompt using conversation history and "policy"
function composePrompt({ history, userInput, mood }) {
  const last = history.slice(-8).map(h => `${h.role}: ${h.text}`).join('\n');
  return `Owner: Sulayer\nAssistant name: Raven (she/her)\nMood: ${mood}\n\nHistory:\n${last}\n\nUser: ${userInput}\n\nInstructions: Respond concisely, friendly, use hinglish when appropriate.`;
}

// Example: call an LLM API (generic wrapper)
async function callLLM(modelName, prompt) {
  const cfg = loadConfig();
  // NOTE: DO NOT commit your real keys. They live only in config/local.json.
  // This wrapper shows the pattern; adapt per-API (headers, endpoint, body).
  const apiKey = cfg.openai_api_key || '';
  const url = 'https://api.openai.com/v1/chat/completions'; // sample: adapt
  const resp = await axios.post(url, {
    model: modelName,
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 512
  }, {
    headers: { Authorization: `Bearer ${apiKey}` }
  });
  return resp.data;
}

// High-level executeFlow:
// 1) read memory, 2) compose prompt, 3) call chosen API(s), 4) post-process (mood/voice)
async function executeFlow({ history, userInput, preferredModel, mood }) {
  const prompt = composePrompt({ history, userInput, mood });
  // Example orchestration: call OpenAI for chat + DeepSeek for code if asked
  const chatResp = await callLLM(preferredModel || 'gpt-4o', prompt);
  // post process: apply tone adjustments (placeholder)
  const content = chatResp.choices?.[0]?.message?.content || JSON.stringify(chatResp);
  return { text: content, meta: { modelUsed: preferredModel } };
}

module.exports = { executeFlow };
