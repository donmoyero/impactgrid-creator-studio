# DIJO CREW 🎬
### Live AI Acting Crew for Social Media Content Creators

DIJO Crew is a live studio experience where AI agents perform, script, and create social media content for Instagram, TikTok, YouTube, and LinkedIn — powered by Google Gemini.

---

## 🗂 File Structure

```
dijo-crew/
├── api/
│   └── generate.js       ← Gemini AI server (Express)
├── public/
│   └── index.html        ← Full website frontend
├── .env.example          ← Environment variable template
├── .gitignore
├── package.json
└── README.md
```

---

## ⚡ Setup

### 1. Clone & install
```bash
git clone https://github.com/YOUR_USERNAME/dijo-crew.git
cd dijo-crew
npm install
```

### 2. Set up environment variables
```bash
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY
```

### 3. Run locally
```bash
npm start
# Server runs on http://localhost:3000
```

---

## 🚀 Deploy to Render

1. Push this repo to GitHub
2. Go to [render.com](https://render.com) → New → Web Service
3. Connect your GitHub repo
4. Set:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Add environment variable: `GEMINI_API_KEY` = your key
6. Deploy!

---

## 🎭 Agents

| Agent | Platform | Specialty |
|-------|----------|-----------|
| DIJO-IG | Instagram | Reels, captions, aesthetic content |
| DIJO-TT | TikTok | Viral hooks, fast-paced scripts |
| DIJO-YT | YouTube | Long-form, retention-focused |
| DIJO-LI | LinkedIn | Thought leadership, B2B |

---

## 📡 API

### POST `/generate`

**Request body:**
```json
{
  "agent": "DIJO-IG",
  "contentType": "caption",
  "brief": "Your brand or topic here"
}
```

**Content types:** `caption` · `script` · `hashtags` · `schedule` · `ideas`

**Response:**
```json
{
  "text": "Generated content...",
  "agent": "DIJO-IG",
  "contentType": "caption",
  "platform": "Instagram"
}
```

---

## 🔑 Environment Variables

| Variable | Description |
|----------|-------------|
| `GEMINI_API_KEY` | Your Google AI Studio API key |
| `PORT` | Server port (default: 3000) |

---

Built with ❤️ by the DIJO Crew team.
