import React, { useEffect, useState, useRef } from 'react'
import orchestrator from '../shared/orchestrator'

export default function App(){
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])
  const [cfg, setCfg] = useState(null)
  const messagesRef = useRef(messages)
  useEffect(()=>{ messagesRef.current = messages }, [messages])

  useEffect(()=>{ const c = window.electronAPI.readLocalConfig(); setCfg(c); }, [])

  async function send(){
    if(!input) return
    const userMsg = { role: 'user', text: input, time: new Date().toISOString() }
    setMessages(prev=>[...prev, userMsg])
    setInput('')
    const res = await orchestrator.execute({ history: messagesRef.current, userInput: userMsg.text, mood: 'playful' })
    const assistant = { role: 'assistant', text: res.text, time: new Date().toISOString() }
    setMessages(prev=>[...prev, assistant])
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <header className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Raven — Rea Rea</h1>
        <div className="text-sm text-gray-600">Owner: Sulayer</div>
      </header>

      <div className="h-96 overflow-auto bg-white rounded-lg shadow p-4 mb-4">
        {messages.map((m,i)=> (
          <div key={i} className={`mb-3 ${m.role==='user'?'text-right':''}`}>
            <div className="text-sm text-gray-500">{m.role==='user'? 'You' : 'Raven'}</div>
            <div className="mt-1 inline-block bg-gray-100 px-3 py-2 rounded">{m.text}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input className="flex-1 p-2 border rounded" value={input} onChange={e=>setInput(e.target.value)} placeholder="Say something to Raven..." />
        <button onClick={send} className="px-4 py-2 bg-blue-600 text-white rounded">Send</button>
      </div>

    </div>
  )
}
