// DeepSeek adapter (stubbed)
const fs = require('fs')
const path = require('path')
const axios = require('axios')

function loadConfig(){
  const cfgPath = path.join(process.cwd(), 'config', 'local.json')
  try{ return JSON.parse(fs.readFileSync(cfgPath,'utf-8')) }catch(e){ return {} }
}

async function call({ prompt }){
  const cfg = loadConfig()
  if(!cfg.deepseek_api_key){
    return { text: `Mocked DeepSeek script generated. Summary: ${prompt.slice(0,200)}...` }
  }
  // Example HTTP call (replace with real DeepSeek API shape)
  const resp = await axios.post('https://api.deepseek.example/v1/generate', { prompt }, { headers: { Authorization: `Bearer ${cfg.deepseek_api_key}` } })
  return { text: resp.data?.result || JSON.stringify(resp.data) }
}

module.exports = { call }
