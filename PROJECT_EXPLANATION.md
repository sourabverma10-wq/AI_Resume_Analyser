# Project Explanation: AI Resume Analyzer

This project is a small full-stack application that helps a recruiter or HR person compare a candidate's resume with a job description and get a match score. It also gives AI-style suggestions and stores candidate analysis results in memory while the backend is running.

## 1. Project idea

The app does this:

- Accepts a PDF resume from the user
- Reads the text inside that PDF
- Extracts important keywords from the job description
- Compares resume words with those keywords
- Calculates a match percentage
- Displays strengths, weaknesses, and suggestions
- Saves each candidate result temporarily in the server
- Lets an admin log in and review candidate submissions
  
This is a beginner-friendly project and is designed to be easy to understand.

---

## 2. Folder structure

- client/ - frontend built with React + Vite
- server/ - backend built with Node.js + Express
- README.md - project instructions

### Frontend files

- client/src/App.jsx - main UI and app logic
- client/src/main.jsx - starts the React app
- client/src/styles.css - styling for the UI

### Backend files 

- server/server.js - starts Express server and sets up routes
- server/routes/analyze.js - handles PDF upload and resume analysis
- server/routes/candidates.js - returns saved candidates
- server/routes/admin.js - admin login logic
- server/services/aiAnalyzer.js - AI explanation generation fallback logic
- server/services/candidateStore.js - in-memory storage

---

## 3. How the app works

The overall flow is:

1. User opens the frontend
2. User fills in candidate details and uploads a PDF
3. Frontend sends the data to the backend API
4. Backend reads the PDF text
5. Backend compares resume text with job description keywords
6. It calculates score and explanation text
7. Result is shown to the user
8. HR can log in and see all saved candidate analyses

---

## 4. File-by-file explanation

## client/src/App.jsx

This is the main frontend file. It contains nearly all the UI logic for the project.

### Import section

```jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
```

- useState is React's built-in hook used to store values like form data, errors, and selected page.
- useEffect runs code when a component loads or updates.
- axios is used to send HTTP requests to the backend API.

### API base URL

```jsx
const API = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');
```

This tells the frontend where the backend lives. In local development, `client/.env` can contain `VITE_API_URL=http://localhost:5000/api`. In Netlify, set `VITE_API_URL` to the deployed backend URL ending in `/api`.

- The backend server runs on port 5000.
- The frontend sends requests to routes like `/api/analyze` and `/api/candidates`.

### Empty form state

```jsx
const emptyForm = { name: '', email: '', phone: '', jobDescription: '', resume: null };
```

This object represents the initial values for the resume analysis form.

- name: candidate's name
- email: candidate email
- phone: optional phone number
- jobDescription: job description pasted by the user
- resume: selected PDF file

This object is reused whenever the form is reset.

---

## Layout component

```jsx
function Layout({ children, navigate }) {
```

This component wraps every page with the same header and footer.

### Header area

```jsx
<header>
  <div className="nav inner">
    <button className="brand" onClick={() => navigate('home')}>
      AI Resume <span>Analyzer</span>
    </button>
    <nav>
      <button onClick={() => navigate('analyze')}>Analyze Resume</button>
      <button onClick={() => navigate('admin')}>HR Login</button>
    </nav>
  </div>
</header>
```

- The header stays at the top of the page.
- The brand button brings the user back to the home screen.
- nav contains buttons for analyzing a resume and opening HR login.
- navigate is a function passed from the main app to change the page.

### Main content area

```jsx
<main className="inner">{children}</main>
```

This area renders whichever page is active.

### Footer

```jsx
<footer>AI Resume Analyzer <span>College project | Simple, explainable matching</span></footer>
```

This is a simple footer at the bottom of the page.

---

## Home component

```jsx
function Home({ navigate }) {
```

This is the landing page shown when the app first loads.

### Hero section

```jsx
<section className="hero">
```

This is the main welcome section.

```jsx
<div className="eyebrow">RESUME INTELLIGENCE</div>
```

Small label above the heading. It gives the page a professional style.

```jsx
<h1>Find out how ready your resume is for the next role.</h1>
```

This headline tells the user the purpose of the tool.

```jsx
<p>Upload a PDF, add a job description, and get a clear skill match report powered by keyword analysis and helpful AI explanations.</p>
```

This explains the main features of the application in human language.

```jsx
<button className="primary" onClick={() => navigate('analyze')}>
  Analyze my resume <b>→</b>
</button>
```

This button moves the user into the analysis form.

### Privacy note

```jsx
<div className="hero-note">
  <span>✓</span> Private by design: we store extracted text, not the uploaded file.
</div>
```

This assures the user that only extracted text is stored, not the full uploaded PDF file.

---

## Analyzer component

```jsx
function Analyzer({ navigate, setResult }) {
```

This component handles the resume upload form.

### State setup

```jsx
const [form, setForm] = useState(emptyForm);
const [loading, setLoading] = useState(false);
const [error, setError] = useState('');
```

- form stores all user input for the form
- loading becomes true while the analysis request is in progress
- error stores messages if the API request fails

### Form update logic

```jsx
const update = event => setForm({
  ...form,
  [event.target.name]: event.target.type === 'file' ? event.target.files[0] : event.target.value
});
```

This function updates the form state.

- If the field is a file input, it stores the selected file.
- Otherwise it stores the entered text.
- The spread operator keeps previous values and updates only the changed field.

### Submit function

```jsx
const submit = async event => {
```

This runs when the user submits the form.

```jsx
event.preventDefault();
```

This prevents the browser from refreshing the page.

```jsx
setError('');
setLoading(true);
```

Clears previous errors and shows a loading state while the request is running.

```jsx
const data = new FormData();
````

FormData is used because the backend expects a file upload along with text fields.

```jsx
Object.entries(form).forEach(([key, value]) => data.append(key, value || ''));
```

This loops through all fields and appends them to the form data object.

- For file upload, it sends the PDF file
- For text fields, it sends the entered values
- If a value is empty, it sends an empty string

### API call

```jsx
const response = await axios.post(`${API}/analyze`, data);
```

This sends the form data to the backend analysis route.

```jsx
setResult(response.data);
```

The backend response includes score and analysis information, which is saved in state.

```jsx
navigate('results');
```

This switches the app view to the results screen.

### Error handling

```jsx
catch (requestError) {
  setError(requestError.response?.data?.message || 'Could not analyze the resume. Is the server running?');
}
```

If the request fails, the app shows a friendly error message.

- It first tries to show the backend's message.
- Otherwise it shows a default message.

```jsx
finally {
  setLoading(false);
}
```

This always runs, even after success or failure, to stop the loading indicator.

### Form JSX

```jsx
return <section className="form-page">
```

This creates the full form screen.

```jsx
<div className="eyebrow">ANALYZE RESUME</div>
<h1>Match your experience to an opportunity.</h1>
```

These headings explain the purpose of the form.

```jsx
<p className="lead">The score is calculated by comparing important job-description keywords with your resume.</p>
```

This tells the user how the match score is computed.

Then the form includes fields for:

- Candidate name
- Email
- Phone
- Resume PDF upload
- Job description text area

```jsx
{error && <div className="error">{error}</div>}
```

This shows any error message if a request fails.

```jsx
<button className="primary" disabled={loading}>
  {loading ? 'Analyzing...' : 'Analyze Resume'} <b>→</b>
</button>
```

This button disables while processing and shows a loading label.

---

## List component

```jsx
function List({ title, items, tone }) {
```

This simple reusable component displays a list of skills or suggestions.

```jsx
<div className="list-block">
```

Container for one section of the results.

```jsx
{items?.length ? items.map((item, index) => <span className="tag" key={`${item}-${index}`}>{item}</span>) : <span className="muted">None found</span>}
```

- If there are items, it displays each one as a tag.
- If there are no items, it shows "None found".
- The key property helps React keep list items stable.

---

## Results component

```jsx
function Results({ result, navigate }) {
```

This screen shows the final analysis result.

```jsx
if (!result) return <section className="empty">
```

If the user has not analyzed a resume yet, it shows a placeholder screen.

### Full result display

```jsx
<div className="result-heading">
```

This section shows the candidate name and match score.

```jsx
<div className="score">
  <strong>{result.matchScore}%</strong>
  <span>Match score</span>
</div>
```

This displays the percentage value in a large styled box.

### Score bar

```jsx
<div className="score-bar">
  <i style={{ width: `${result.matchScore}%` }} />
</div>
```

This shows a progress bar that grows according to match score.

### Result grid

```jsx
<div className="result-grid">
```

This holds the result data in columns.

```jsx
<List title="Matching skills" items={result.matchingSkills} tone="good" />
<List title="Missing skills" items={result.missingSkills} tone="missing" />
```

- Matching skills: skills the candidate shows
- Missing skills: skills not found in the resume

```jsx
<List title="Resume strengths" items={result.strengths} />
<List title="Resume weaknesses" items={result.weaknesses} />
<List title="Suggestions" items={result.suggestions} />
```

This area shows AI explanation or fallback explanation text.

---

## Admin component

```jsx
function Admin({ navigate }) {
```

This is the login page for the HR dashboard.

### Login state

```jsx
const [login, setLogin] = useState({ username: '', password: '' });
const [error, setError] = useState('');
```

This tracks the admin credentials and any login errors.

### Submit logic

```jsx
const submit = async event => {
```

When the form is submitted, it sends the credentials to the backend.

```jsx
await axios.post(`${API}/admin/login`, login);
```

This calls the admin login endpoint.

```jsx
navigate('dashboard');
```

If login is successful, the user goes to the dashboard page.

```jsx
catch { setError('Invalid admin username or password.'); }
```

If the backend rejects the login, the app shows an error message.

```jsx
<p className="hint">Demo credentials are configured in the server .env file.</p>
```

This tells the admin where to find the login details.

---

## Dashboard component

```jsx
function Dashboard({ navigate, setCandidate }) {
```

This component shows all candidate submissions in a table.

### Candidate state

```jsx
const [candidates, setCandidates] = useState([]);
const [error, setError] = useState('');
```

- candidates stores the list of all analyses
- error stores fetch failures

### useEffect for fetching data

```jsx
useEffect(() => {
  axios.get(`${API}/candidates`)
    .then(response => setCandidates(response.data))
    .catch(() => setError('Could not load candidates. Check that the server is running.'));
}, []);
```

This runs once when the dashboard loads.

- It requests all candidates from the backend.
- If successful, it stores them in state.
- If not, it shows a message.

### Sorting candidates

```jsx
const sorted = [...candidates].sort((a, b) => b.matchScore - a.matchScore);
```

This sorts candidates by highest match score first.

### Table rows

```jsx
<tbody>{sorted.map(candidate => <tr key={candidate._id}> ... </tr>)}</tbody>
```

Each candidate appears as a row with:

- Name
- Email
- Match score
- Date
- View details button

### View details button

```jsx
<button className="view" onClick={async () => {
  const response = await axios.get(`${API}/candidates/${candidate._id}`);
  setCandidate(response.data);
  navigate('details');
}}>View details →</button>
```

This loads one specific candidate and opens the detail screen.

---

## Details component

```jsx
function Details({ candidate, navigate }) {
```

This screen shows one candidate's complete analysis.

```jsx
if (!candidate) return null;
```

If there is no selected candidate, nothing is shown.

This page includes:

- Candidate name and email
- Match score
- Resume filename
- Analysis date
- Matching skills
- Missing skills
- Strengths
- Weaknesses
- Suggestions
- Full job description

---

## Main App component

```jsx
export default function App() {
```

This is the central app component.

### State

```jsx
const [page, setPage] = useState('home');
const [result, setResult] = useState(null);
const [candidate, setCandidate] = useState(null);
```

- page controls which screen is currently displayed
- result stores the most recent analysis result
- candidate stores the selected candidate for the detail page

### Navigation function

```jsx
const navigate = setPage;
```

This passes the page name directly into child components.

### Conditional page rendering

```jsx
let content = page === 'home' ? <Home navigate={navigate} />
  : page === 'analyze' ? <Analyzer navigate={navigate} setResult={setResult} />
  : page === 'results' ? <Results result={result} navigate={navigate} />
  : page === 'admin' ? <Admin navigate={navigate} />
  : page === 'dashboard' ? <Dashboard navigate={navigate} setCandidate={setCandidate} />
  : <Details candidate={candidate} navigate={navigate} />;
```

This is a compact way to switch between pages based on the current route.

```jsx
return <Layout navigate={navigate}>{content}</Layout>;
```

Finally, the active content is wrapped inside the shared layout.

---

## 5. Backend understanding

### server/server.js

This file creates the Express app and starts the server.

It does the following:

- Loads environment variables from `server/.env`.
- Allows the local frontend and the origin in `FRONTEND_URL` through CORS.
- Parses JSON request bodies.
- Registers the `/api/health`, `/api/analyze`, `/api/candidates`, and `/api/admin` routes.
- Handles Multer upload errors, including files larger than 5 MB.
- Listens on `process.env.PORT || 5000` and binds to `0.0.0.0` for hosting platforms.

### server/routes/analyze.js

This route is the core of the application.

It handles:

- PDF upload
- PDF text extraction using a library like pdf-parse
- Keyword comparison
- Score calculation
- AI explanation call or fallback response
- Saving candidate result in memory

### server/routes/candidates.js

This exposes candidate results.

It provides:

- all stored candidates
- one specific candidate by ID

### server/routes/admin.js

This route handles login by checking the admin username and password from environment variables.

### server/services/aiAnalyzer.js

This file creates the optional AI explanation text. If the AI API key is missing or the request fails, it provides a simple fallback explanation instead of crashing.

### server/services/candidateStore.js

This file stores results in memory while the server is running. When the server restarts, the data is lost.

---

## 6. Why this project is useful

This project teaches how to build:

- a frontend with React
- a backend with Express
- file upload handling
- PDF text extraction
- a simple keyword matching algorithm
- AI API integration with a fallback
- admin login flow
- small dashboard UI

It is a very practical beginner project because it combines frontend and backend logic in a realistic workflow.

---

## 7. Summary

This project is a resume matching system. It lets users upload a resume, compare it with a job description, view a percentage match score, and inspect suggestions and weaknesses. The backend holds candidate data in memory, and the HR dashboard lets the admin review the results.

The main file that powers the frontend is App.jsx, and it is an excellent example of how React state, forms, API requests, and page navigation work together.

---

## 8. Complete request flow

### Resume analysis flow

```text
User selects a PDF and enters form data
  |
  v
App.jsx creates FormData
  |
  | POST {VITE_API_URL}/analyze
  | field name for the file: resume
  v
server/routes/analyze.js
  |
  +-- Multer reads the PDF into memory
  +-- Validates name, email, job description, and PDF
  +-- pdf-parse extracts resume text
  +-- Finds keywords in the job description
  +-- Searches for those keywords in the resume
  +-- Calculates the match score
  +-- Gets AI or fallback explanations
  +-- Saves the result in candidateStore.js
  v
App.jsx displays the result page
```

The PDF is not written to disk. Multer uses memory storage. The server stores the original filename and extracted text in memory, so all candidate data disappears when the server restarts.

### API routes

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/health` | Confirms that the backend is running. |
| POST | `/api/analyze` | Receives candidate fields and a PDF, then returns the analysis. |
| POST | `/api/admin/login` | Checks the configured admin username and password. |
| GET | `/api/candidates` | Returns all candidates without full resume text and job description. |
| GET | `/api/candidates/:id` | Returns one complete candidate analysis. |

The frontend uses the same `API` constant for every request. Therefore, changing `VITE_API_URL` changes the backend used by analysis, login, candidate listing, and candidate details.

## 9. Environment variables

### Frontend: `client/.env`

```text
VITE_API_URL=http://localhost:5000/api
```

Only public configuration belongs in a Vite variable. Never put an AI key, password, or database credential in a variable beginning with `VITE_`, because Vite includes it in the browser build.

### Backend: `server/.env`

```text
PORT=5000
FRONTEND_URL=https://YOUR-NETLIFY-SITE.netlify.app
ADMIN_USERNAME=your-admin-username
ADMIN_PASSWORD=your-strong-admin-password
AI_API_KEY=
AI_API_URL=https://api.openai.com/v1/chat/completions
AI_MODEL=gpt-4o-mini
```

`FRONTEND_URL` may contain more than one comma-separated frontend origin. Local development origins on ports 5173 are allowed automatically. The backend credentials and AI key stay on the server.

## 10. Running locally

From the project root, open two terminals.

Backend:

```powershell
cd server
npm install
copy .env.example .env
npm run dev
```

Frontend:

```powershell
cd client
npm install
copy .env.example .env
npm run dev
```

Open the Vite URL, normally `http://localhost:5173`. Test the backend separately at `http://localhost:5000/api/health`.

## 11. Deployment explanation

### Netlify frontend and backend

- Base directory: `client`
- Build command: `npm install; npm install --prefix ../server; npm run build`
- Publish directory: `dist`
- Function directory: `server/netlify/functions`
- Environment variables: `FRONTEND_URL`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`, and optional AI settings

The `client/public/_redirects` file sends `/api/*` to the Netlify Function and sends other browser routes to `index.html`.

`server/server.js` exports the Express app for both local development and Netlify. `server/netlify/functions/api.js` adapts that app to Netlify's Function handler. In production, the browser calls `/api/analyze` on the same Netlify domain, and the redirect passes it to Express.

In production, do not set `VITE_API_URL`; the frontend's default `/api` value is correct. The health check is `https://your-site.netlify.app/api/health`.

## 12. Important limitations

- Candidate data is temporary in-memory data, not a permanent database.
- The admin login is a basic credential check and does not create a session or token.
- Scanned image PDFs are not processed because OCR is not included.
- The score is keyword matching, not a trained machine-learning model.
- The optional AI service affects explanations only; it does not calculate the match score.
