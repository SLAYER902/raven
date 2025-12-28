# Raven / Rea Rea — Local AI Agent (phase 1)

This update adds a Vite + React renderer, Tailwind styling, an orchestrator with API adapters (mocked if no keys), and a Coqui TTS helper script. It's designed to run fully local-first and to be safe by default.

Quick start:
1. Clone: git clone https://github.com/SLAYER902/raven.git
2. Install: npm install
3. Create folders and config:
   mkdir -p data user_files projects
   cp config/local.example.json config/local.json
   Edit config/local.json with your keys (do NOT commit this file).
4. Dev: npm run dev (Vite dev server) in one terminal, and in another run Electron pointing to built files for packaged mode. For dev convenience you can run `npm run dev` and then `npm start` in a separate terminal after building.

Notes:
- Adapters are mocked when API keys are absent. Add keys to config/local.json to enable real API calls.
- Automation and destructive actions remain gated; see src-electron/preload.js and src-electron/main.js for confirmation flow.
