# AI Resume Analyzer & Job Match System

A simple college-level project that compares a PDF resume with a job description. The application uses a transparent keyword algorithm for the score and an optional AI API for explanation text.

## What the project demonstrates

- React frontend with basic JavaScript and CSS
- Node.js and Express REST API
- PDF upload and text extraction
- Keyword matching and score calculation
- Optional AI API integration kept in one backend service
- In-memory candidate data storage
- Basic admin login and HR dashboard

## Architecture

```text
React form
   |
   | Axios + multipart/form-data
   v
Express POST /api/analyze
   |
   +-- Multer receives PDF in memory
   +-- pdf-parse extracts text
   +-- Node compares job keywords with resume text
   +-- services/aiAnalyzer.js creates explanation
   +-- In-memory store keeps candidate results while the server runs
   v
React results page
```

The uploaded PDF is not permanently saved. Only its filename and extracted text are stored. The score does not depend completely on AI, so the main algorithm is easy to explain and still works when no AI key is configured.

## Required software

1. Node.js 18 or newer: https://nodejs.org/
2. A browser and a code editor such as VS Code

Check Node and npm:

```bash
node --version
npm --version
```

## Folder structure

```text
ai-resume-analyzer/
├── client/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server/
│   ├── routes/analyze.js
│   ├── routes/candidates.js
│   ├── routes/admin.js
│   ├── services/aiAnalyzer.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── .gitignore
└── README.md
```

## Installation

Open two terminals from the project root.

Terminal 1, backend:

```bash

npm install
copy .env.example .env
npm run dev
```

Terminal 2, frontend:

```bash
cd client
npm install
npm run dev
```

Open the URL printed by Vite, normally `http://localhost:5173`.

On macOS/Linux, use `cp .env.example .env` instead of `copy .env.example .env`.

Candidate submissions are kept in server memory and are cleared whenever the server restarts. No database setup is required.

## Environment variables

The server reads these values from `server/.env`:

```text
PORT=5000
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
AI_API_KEY=
AI_API_URL=https://api.openai.com/v1/chat/completions
AI_MODEL=gpt-4o-mini
```

`AI_API_KEY` can be empty. In that case the application uses a local fallback explanation. To enable AI explanations, place the key in `.env`, never in React code.

## How the score works

1. The backend looks for known technical and soft skills, such as React, Java, SQL, Git, AWS, and communication.
2. It also takes important words from the job description.
3. Each keyword is searched in the extracted resume text.
4. The formula is:

```text
Match Score = (matching keywords / total job keywords) x 100
```

For example, 8 matching keywords out of 10 important keywords gives 80%. AI does not decide this number. AI only gives strengths, weaknesses, and suggestions.

## Important files

- `server/server.js`: starts Express and registers routes.
- `server/routes/analyze.js`: validates input, receives the PDF, extracts text, calculates the score, calls the AI service, and stores the candidate in memory.
- `server/services/aiAnalyzer.js`: sends a small prompt to the AI API and safely validates the three explanation arrays. It returns fallback text when the API is missing or fails.
- `server/services/candidateStore.js`: stores candidate results in memory.
- `server/routes/candidates.js`: returns candidate lists and one candidate detail.
- `server/routes/admin.js`: performs the deliberately simple admin credential check.
- `client/src/App.jsx`: contains the home, analyzer, result, login, dashboard, and details views.
- `client/src/styles.css`: contains the responsive light interface.

## REST API testing

### Health check

```bash
curl http://localhost:5000/api/health
```

### Admin login

```bash
curl -X POST http://localhost:5000/api/admin/login ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"admin\",\"password\":\"admin123\"}"
```

### Analyze a resume

Windows PowerShell:

```powershell
$form = @{ name = 'Priya Sharma'; email = 'priya@example.com'; phone = '9876543210'; jobDescription = 'React JavaScript SQL Git developer' ; resume = Get-Item '.\sample-resume.pdf' }
Invoke-RestMethod -Uri http://localhost:5000/api/analyze -Method Post -Form $form
```

### Get candidates

```bash
curl http://localhost:5000/api/candidates
```

### Get one candidate

```bash
curl http://localhost:5000/api/candidates/CANDIDATE_ID
```

Postman is also suitable: select `POST`, choose `Body > form-data`, add the text fields, and add `resume` as a File.

## Common errors

| Error | Solution |
|---|---|
| Port already in use | Change `PORT` in `server/.env`, and update `API` in `client/src/App.jsx`. |
| Please upload a PDF | Select a file ending in `.pdf`; files larger than 5 MB are rejected. |
| PDF has no readable text | Use a text-based PDF. Scanned image PDFs need OCR, which this beginner version intentionally does not include. |
| AI explanation unavailable | Check `AI_API_KEY` and internet access. The local fallback should still return a result. |
| Admin login fails | Use the exact `ADMIN_USERNAME` and `ADMIN_PASSWORD` values in `.env`. |
| CORS or network error | In production, confirm the Render backend is running, `FRONTEND_URL` exactly matches the Netlify URL, and Netlify has `VITE_API_URL` set to the Render URL ending in `/api`. Locally, confirm the backend is running on port 5000 and the frontend on port 5173. |

## Deploy the backend

Netlify hosts the React frontend, but it does not run the long-lived Express process in `server/server.js`. Deploy the backend as a separate Render web service:

1. Push this repository to GitHub and create a new Render Blueprint using the repository. Render detects the root `render.yaml` file and creates the API service with `server` as its root directory.
2. In the Render service environment settings, set `FRONTEND_URL` to the exact Netlify site URL, for example `https://your-site.netlify.app`.
3. Set `ADMIN_USERNAME` and `ADMIN_PASSWORD`. Leave `AI_API_KEY` empty if the local fallback explanations are sufficient.
4. After deployment, open `https://YOUR-RENDER-SERVICE.onrender.com/api/health`. It must return `{"status":"ok"}`.
5. In Netlify, set `VITE_API_URL` to `https://YOUR-RENDER-SERVICE.onrender.com/api` and trigger a new frontend deploy. Vite embeds this value at build time, so changing it requires a rebuild.

## Viva questions and easy answers

1. **What is the purpose of this project?** It compares a resume with a job description and reports how well the skills match.
2. **Why is React used?** React lets us create reusable UI components and update the result screen without reloading the page.
3. **Why is Express used?** Express provides simple REST API routes for upload, analysis, login, and candidate data.
4. **How is PDF text extracted?** Multer receives the PDF in memory and `pdf-parse` reads its text.
5. **How is the match score calculated?** We divide matching job keywords by total important job keywords and multiply by 100.
6. **Why not let AI calculate the score?** A local algorithm makes the score transparent, repeatable, and easy to explain.
7. **What does the AI API do?** It suggests strengths, weaknesses, and improvements after the local score is calculated.
8. **Where is the AI key stored?** In the backend `server/.env` file, never in React.
9. **Where are candidate results stored?** In server memory while the application is running; they are cleared when the server restarts.cd server
10. **What happens if the AI API fails?** The backend catches the error and returns simple fallback explanations instead of crashing.

## Limitations and future improvements

This is intentionally a small college project. It does not use OCR for scanned PDFs, JWT authentication, resume file storage, or a trained machine-learning model. Future versions could add OCR, proper admin sessions, more skill dictionaries, pagination, and an improved matching algorithm.
