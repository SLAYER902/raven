// Minimal React UI skeleton (you'll want to replace with a full design)
const React = require('react');
const ReactDOM = require('react-dom');
const { useState, useEffect } = React;

function App() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [cfg, setCfg] = useState(null);

  useEffect(() => {
    // read local config via preload
    const c = window.electronAPI.readLocalConfig();
    setCfg(c);
  }, []);

  async function send() {
    if (!input) return;
    const msg = { role: 'user', text: input, time: new Date().toISOString() };
    setMessages(prev => [...prev, msg]);
    setInput('');
    // Call agent via a simple HTTP/IPC shim — to keep this starter minimal we'll call agent directly
    const { executeFlow } = require('../agent/agent.js');
    const res = await executeFlow({ history: messages, userInput: msg.text, preferredModel: 'gpt-4o', mood: 'playful' });
    const reply = { role: 'assistant', text: res.text, time: new Date().toISOString() };
    setMessages(prev => [...prev, reply]);
  }

  return React.createElement('div', { style: { padding: 20, fontFamily: 'Inter, Arial' } },
    React.createElement('h1', null, 'Raven — Local Agent'),
    React.createElement('div', { style: { maxHeight: 400, overflow: 'auto', border: '1px solid #ddd', padding: 10 } },
      messages.map((m, i) => React.createElement('div', { key: i, style: { margin: '8px 0' } },
        React.createElement('strong', null, m.role === 'user' ? 'You' : 'Raven'),
        React.createElement('div', null, m.text)
      ))
    ),
    React.createElement('div', { style: { marginTop: 12 } },
      React.createElement('input', { value: input, onChange: e => setInput(e.target.value), style: { width: '70%', padding: 8 } }),
      React.createElement('button', { onClick: send, style: { padding: '8px 12px', marginLeft: 8 } }, 'Send')
    )
  );
}

ReactDOM.render(React.createElement(App), document.getElementById('root'));
