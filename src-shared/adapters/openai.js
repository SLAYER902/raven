// OpenAI adapter (stubbed). Reads key from config/local.json
const fs = require('fs')
const path = require('path')
const axios = require('axios')

function loadConfig(){
  const cfgPath = path.join(process.cwd(), 'config', 'local.json')
  try{ return JSON.parse(fs.readFileSync(cfgPath,'utf-8')) }catch(e){ return {} }
}

async function call({ prompt }){
  const cfg = loadConfig()
  if(!cfg.openai_api_key){
    // return a mocked friendly reply for offline/testing
    return { text: `Mocked Raven reply (no OpenAI key). Prompt summary: ${prompt.slice(0,200)}...` }
  }
  // real request shape depends on API — show example for OpenAI Chat Completion
  const resp = await axios.post('https://api.openai.com/v1/chat/completions', {
    model: 'gpt-4o', messages: [{ role: 'system', content: 'You are Raven assistant.' }, { role: 'user', content: prompt }], max_tokens: 512
  }, { headers: { Authorization: `Bearer ${cfg.openai_api_key}` } })

  const text = resp.data?.choices?.[0]?.message?.content || JSON.stringify(resp.data)
  return { text }
}

module.exports = { call }
