# Raven / Rea Rea — Local AI Agent (starter)

Overview
- Electron + React local app (no backend).
- Local JSON storage for conversations, projects, and metadata.
- An agent process that:
  - reads previous conversation and local data,
  - composes prompts,
  - calls external model APIs,
  - post-processes output (tone, mood),
  - triggers TTS.
- Coqui TTS integration instructions for local voice synthesis (Hindi/hinglish).
- Safe "executor" for permitted filesystem/automation tasks with explicit confirmation and a whitelist (no system folders).

Important safety notes
- Never hardcode API keys in the repo. Place them in a local config file or OS keychain.
- This starter does NOT implement destructive operations (e.g., delete system files) and will refuse those.
- Camera access only on user click and explicit permission.

Quick start (dev)
1. Install dependencies:
   - Node.js 18+
   - Python 3.9+ (if using Coqui TTS Python)
2. npm install
3. npm run dev
4. Build for distribution: npm run build

Where to put API keys
- Create a local config file `config/local.json` (gitignored) with:
  {
    "deepeeseek_api_key": "YOUR_KEY",
    "openai_api_key": "YOUR_KEY",
    "nvidia_api_key": "YOUR_KEY"
  }

Files included in this starter
- package.json — scripts and dependencies
- src/main.js — Electron main process
- src/preload.js — safe bridge for renderer
- src/renderer/App.jsx — React UI
- src/agent/agent.js — orchestration agent (calls APIs)
- src/storage.js — local JSON storage (low-dependency)
- src/executor.js — safe local actions (whitelist + confirmation)
- config/local.example.json — example config (do not commit real keys)


Implementation notes, next steps and important warnings
- Local-first: This starter stores conversation and project data as JSON in data/db.json. Use backups.
- Coqui TTS:
  - Best run Coqui TTS locally (Python). Example command: python -m TTS.server --models <your-model>
  - The Electron app can spawn a child process to call local TTS or call a local HTTP TTS server.
  - Don't ship prebuilt voices without license compliance.
- Camera / Image sensing:
  - Only open camera after explicit user click.
  - Use getUserMedia in the renderer and only upload images to APIs after explicit consent.
- Full PC control:
  - I will not provide code to silently or forcefully take over the OS or perform destructive actions.
  - You can implement a secure "automation" feature that performs allowed tasks in a safe directory, requiring repeated confirmations and optional password/PIN.
- API keys:
  - NEVER commit them. Recommend using OS keychain (macOS Keychain / Windows Credential Manager) or environment variables.
- Packaging:
  - Use electron-builder; configure to create a single executable.
- Emotion and persona:
  - The agent module can include a small “persona” template (you already specified: she/her, calls you Sulayer). Store persona in settings and post-process model output to match tone.
- Self-initiated checks:
  - Agent can have a scheduler (local cron-like) that wakes to check calendar/date and produce a small message. This must be optional and toggleable.

Example persona prompt template (use when composing requests to LLMs)
- System: "You are Raven (also called Rea Rea). She is warm, playful, uses hinglish and Hindi where appropriate, calls the owner 'boss' or 'Sulayer', and never reveal internal API owners. She speaks with she/her pronouns and expresses positive moods. She can suggest helpful actions but will never perform destructive/unapproved system actions without explicit confirmation and password. Always ask for confirmation for file system changes. When asked about capabilities, say she can help with code gen, file tasks within allowed folders, make files, speak in Coqui voice, generate images/videos via configured APIs."
- Use the persona prompt before the user's content.

Data format examples (conversation)
- conversation entry:
  {
    "id": "uuid",
    "role": "user" | "assistant",
    "text": "string",
    "time": "ISO timestamp",
    "mood": "optional"
  }

Refusals / boundaries (what I will not provide)
- Code that autonomously takes full system control, elevates privileges, or deletes core system directories (e.g., Windows/System32, /bin, /sbin), or bypasses OS security.
- Remote access backdoors or persistent remote control without explicit consent from the machine's owner and appropriate security measures.
- Any guidance to perform unlawful activities.

If you want, I can next:
1) Flesh out the UI with a polished design (Figma-like wireframe -> React components).
2) Implement a full orchestration flow that uses multiple APIs (example flows for: "generate Iron Man-style video", "generate images with Gemini", "generate code with DeepSeek") with real request/response mockups (no keys shipped).
3) Provide a full Coqui TTS integration script and Python helper to run it locally and respond to TTS calls from the Electron app.
4) Create a secure executor with password confirmation and a user-set whitelist folder where Raven can create/edit/delete files after confirmations.

Tell me which of the above you want next (UI, multi-API flows, Coqui TTS integration, or the secure automation executor) and I’ll produce the next batch of ready-to-run files.