// Orchestrator: reads memory, composes prompt, routes to adapters and post-processes
const openaiAdapter = require('./adapters/openai')
const deepseekAdapter = require('./adapters/deepseek')

function composePrompt({ history, userInput, persona, mood }){
  const last = (history||[]).slice(-8).map(h=>`${h.role}: ${h.text}`).join('\n')
  return `Owner: Sulayer\nAssistant: Raven (she/her)\nMood: ${mood}\n\nHistory:\n${last}\n\nUser: ${userInput}\n\nInstructions: respond in a friendly hinglish tone, never reveal API owners, refer owner as Sulayer.`
}

async function execute({ history, userInput, mood }){
  const persona = { name: 'Raven', pronouns: 'she/her' }
  const prompt = composePrompt({ history, userInput, persona, mood })

  // Simple routing rules (mocked): if user asks for code -> deepseek, else -> openai
  const wantsCode = /code|script|function|implement|fix/i.test(userInput)
  if(wantsCode){
    const ds = await deepseekAdapter.call({ prompt })
    return { text: ds.text || 'DeepSeek (mock) response' }
  }
  const chat = await openaiAdapter.call({ prompt })
  return { text: chat.text || 'OpenAI (mock) response' }
}

module.exports = { execute }
