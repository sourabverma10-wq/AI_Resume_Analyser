# AI Resume Analyzer and Job Match System

## 1. Project Introduction

Mera project **AI Resume Analyzer and Job Match System** hai.

Ye application resume PDF ko saved job requirements ke saath compare karti hai. User resume upload karta hai aur dropdown se job select karta hai. System selected job ki requirements ke keywords se match score calculate karta hai.

Application user ko ye information deti hai:

- Resume aur job description ka match score
- Resume mein milne wali skills
- Resume mein missing skills
- Resume strengths
- Resume weaknesses
- Resume improve karne ke suggestions

HR user login karke submitted candidates aur unke analysis reports dekh sakta hai.

---

## 2. Main Objective

Is project ka main objective hai:

1. Resume screening ko simple banana.
2. Resume ko job ke according compare karna.
3. Candidate ko resume improve karne mein help karna.
4. HR ko candidates compare karne ke liye dashboard dena.
5. Score ko transparent rakhna, taaki user samajh sake ki score kaise bana.

---

## 3. Technologies Used

### Frontend

- React
- JavaScript
- HTML
- CSS
- Axios
- Vite

### Backend

- Node.js
- Express.js
- Multer
- pdf-parse
- serverless-http

### Deployment

- Netlify frontend hosting
- Netlify Functions backend hosting
- GitHub for source code and automatic deployment

---

## 4. Project Architecture

```text
User Browser
    |
    | React frontend
    v
Netlify Website
    |
    | /api/* request
    v
Netlify Function
    |
    | serverless-http adapter
    v
Express Backend
    |
    +-- Resume upload route
    +-- PDF text extraction
    +-- Keyword matching
    +-- AI explanation service
    +-- Candidate storage
```

Frontend aur backend dono same Netlify website par run hote hain.

Frontend API ke liye `/api` path use karta hai. Netlify redirect is request ko Netlify Function tak bhejta hai.

---

## 5. User Workflow

User ka workflow is tarah hai:

1. User website open karta hai.
2. Analyze Resume page par jata hai.
3. Candidate name enter karta hai.
4. Email enter karta hai.
5. Optional phone number enter karta hai.
6. Resume ki PDF file select karta hai.
7. Dropdown se Software Engineer ya Frontend Developer select karta hai.
8. Analyze Resume button click karta hai.
9. Frontend selected `jobId` aur form data ko backend `/api/analyze` route par bhejta hai.
10. Backend PDF se text extract karta hai.
11. Backend selected job ki saved requirements se keywords compare karke score calculate karta hai.
12. Result frontend par report ke form mein show hota hai.

---

## 6. Resume Upload Process

Resume upload ke liye frontend `FormData` use karta hai.

FormData mein ye fields backend ko bheji jaati hain:

- `name`
- `email`
- `phone`
- `jobDescription`
- `resume`

Backend mein Multer PDF file receive karta hai. File disk par save nahi hoti; memory mein process hoti hai.

File validation:

- Sirf PDF file allowed hai.
- Maximum file size 5 MB hai.
- Empty ya invalid PDF reject ho sakti hai.

---

## 7. PDF Text Extraction

Backend `pdf-parse` library ka use karke PDF se text extract karta hai.

Process:

1. Multer PDF ko memory mein receive karta hai.
2. `pdf-parse` PDF buffer ko read karta hai.
3. Extracted text ko plain text mein convert kiya jata hai.
4. Agar readable text nahi milta, to error message return hota hai.

Scanned image PDF ke liye OCR included nahi hai. Isliye text-based PDF use karna chahiye.

---

## 8. Match Score Kaise Calculate Hota Hai

Backend selected job ki saved requirements se important keywords nikalta hai.

Common skills ke examples:

- JavaScript
- React
- Node.js
- Express
- SQL
- Java
- Python
- HTML
- CSS
- Git
- Docker
- AWS
- Communication

Selected job ke keywords resume text mein search kiye jaate hain.

Formula:

```text
Match Score = (Matching Keywords / Total Job Keywords) x 100
```

Example:

```text
Total job keywords = 10
Matching keywords = 7
Match Score = (7 / 10) x 100 = 70%
```

Score AI calculate nahi karta. Score local keyword algorithm calculate karta hai. Isse score transparent aur repeatable rehta hai.

---

## 9. AI Explanation Ka Role

AI score calculate nahi karta. AI sirf explanation generate karta hai.

AI ye information generate kar sakta hai:

- Resume strengths
- Resume weaknesses
- Resume improvement suggestions

Agar `AI_API_KEY` configured nahi hai ya AI API fail ho jaati hai, to backend local fallback explanation return karta hai. Isliye application basic result ke liye AI par completely dependent nahi hai.

---

## 10. Backend API Routes

### Health Check

```text
GET /api/health
```

Response:

```json
{"status":"ok"}
```

### Available Jobs

```text
GET /api/jobs
```

Ye route dropdown ke liye available jobs ki list return karta hai.

### Resume Analysis

```text
POST /api/analyze
```

Ye route resume aur selected `jobId` receive karke saved job requirements ke against analysis result return karta hai.

### Admin Login

```text
POST /api/admin/login
```

Ye username aur password verify karta hai.

### Candidate List

```text
GET /api/candidates
```

Ye submitted candidates ki list return karta hai.

### Candidate Details

```text
GET /api/candidates/:id
```

Ye ek candidate ka complete analysis result return karta hai.

---

## 11. HR Dashboard

HR Login page par admin username aur password enter karta hai.

Successful login ke baad dashboard mein ye information show hoti hai:

- Candidate name
- Candidate email
- Match score
- Submission date
- Candidate details button

Candidate details page par matching skills, missing skills, strengths, weaknesses, suggestions aur job description dikhayi jaati hai.

---

## 12. Netlify Deployment Kaise Work Karta Hai

Frontend aur backend dono Netlify par deploy hote hain.

### Frontend

React app `client` folder mein hai. Netlify Vite command run karta hai:

```text
npm run build
```

Build ke baad `client/dist` folder publish hota hai.

### Backend

Express server ko Netlify Function mein wrap kiya gaya hai.

Important file:

```text
client/netlify/functions/api.js
```

Ye file Express app ko Netlify Function format mein convert karti hai.

### API Redirect

File:

```text
client/public/_redirects
```

Ismein rule hai:

```text
/api/*  /.netlify/functions/api/:splat  200
```

Iska meaning hai ki browser ka request:

```text
/api/analyze
```

Netlify Function ko forward hota hai.

### Netlify Configuration

File:

```text
netlify.toml
```

Ye Netlify ko batati hai:

- Base directory `client` hai.
- Frontend build kaise karna hai.
- Publish directory `dist` hai.
- Functions folder kahan hai.
- Server dependencies install karni hain.

---

## 13. Environment Variables

Netlify mein environment variables add karne hote hain.

Required variables:

```text
FRONTEND_URL=https://your-site.netlify.app
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-password
```

Optional AI variables:

```text
AI_API_KEY=your-api-key
AI_API_URL=https://api.openai.com/v1/chat/completions
AI_MODEL=gpt-4o-mini
```

`FRONTEND_URL` mein actual Netlify website URL daalna hota hai.

`ADMIN_USERNAME` aur `ADMIN_PASSWORD` HR login ke liye use hote hain.

AI key optional hai. AI key na ho tab bhi fallback explanation milti hai.

Production mein `VITE_API_URL` ki zaroorat nahi hai, kyunki frontend aur backend same Netlify domain par hain aur frontend default `/api` use karta hai.

---

## 14. Local Project Kaise Run Karein

### Backend Terminal

Project folder se run karein:

```powershell
cd server
npm install
npm start
```

Backend port 5000 par chalega.

Health check:

```text
http://localhost:5000/api/health
```

### Frontend Terminal

Doosre terminal mein run karein:

```powershell
cd client
npm install
npm run dev
```

Frontend normally is URL par chalega:

```text
http://localhost:5173
```

---

## 15. Netlify Deploy Ke Baad Test

Deploy complete hone ke baad health URL open karein:

```text
https://your-site.netlify.app/api/health
```

Expected response:

```json
{"status":"ok"}
```

Uske baad:

1. Website open karein.
2. Analyze Resume page open karein.
3. Name, email aur job description enter karein.
4. Text-based PDF upload karein.
5. Analyze Resume click karein.
6. Analysis report check karein.
7. HR Login se dashboard test karein.

---

## 16. Error Handling

### PDF Error

Agar file PDF nahi hai ya 5 MB se badi hai, error show hota hai.

### Empty PDF Text

Scanned image PDF mein readable text nahi hota. Text-based PDF use karni chahiye.

### Admin Login Error

Netlify environment variables mein `ADMIN_USERNAME` aur `ADMIN_PASSWORD` exact names se configured hone chahiye.

### Backend Error

Pehle health URL check karein:

```text
https://your-site.netlify.app/api/health
```

Agar `{"status":"ok"}` nahi aa raha, to latest Netlify deploy log check karein.

### CORS Error

`FRONTEND_URL` mein exact Netlify URL hona chahiye. URL ke end mein extra slash na lagayein.

Correct:

```text
https://your-site.netlify.app
```

Incorrect:

```text
https://your-site.netlify.app/
```

---

## 17. Project Limitations

1. Candidate data memory mein store hota hai.
2. Function restart hone par data clear ho sakta hai.
3. Permanent database use nahi kiya gaya.
4. Scanned PDFs ke liye OCR nahi hai.
5. Admin authentication simple username-password check hai.
6. JWT session ya advanced security implemented nahi hai.
7. Match score keyword matching par based hai.
8. AI explanation optional hai.

---

## 18. Future Improvements

Future mein ye features add kiye ja sakte hain:

- MongoDB ya PostgreSQL database
- Permanent resume storage
- OCR for scanned PDFs
- JWT-based authentication
- Password hashing
- More advanced skill matching
- Job recommendation system
- Candidate filtering and pagination
- Email notifications
- Resume download and export

---

## 19. Viva Questions and Answers

### Q1. Is project ka purpose kya hai?

Ye project resume ko job description ke saath compare karke match score aur improvement suggestions provide karta hai.

### Q2. React kyon use kiya?

React se interactive frontend aur reusable UI banane mein help milti hai.

### Q3. Express kyon use kiya?

Express REST API banane ke liye simple aur lightweight framework hai.

### Q4. PDF ka text kaise read hota hai?

Multer PDF receive karta hai aur `pdf-parse` uska text extract karta hai.

### Q5. Match score kaise calculate hota hai?

Matching keywords ko total job keywords se divide karke 100 se multiply kiya jata hai.

### Q6. Kya AI score calculate karta hai?

Nahi. Score local keyword algorithm calculate karta hai. AI sirf explanation deta hai.

### Q7. AI API fail hone par kya hota hai?

Backend fallback explanation return karta hai, isliye application completely crash nahi hoti.

### Q8. Candidate data kahan store hota hai?

Currently candidate data server memory mein store hota hai. Server restart hone par clear ho sakta hai.

### Q9. Netlify Function kyon use ki?

Netlify frontend ke saath backend API ko serverless format mein run karne ke liye Netlify Function use ki gayi.

### Q10. `/api` redirect ka kya role hai?

Redirect browser ke `/api` requests ko Netlify Function tak forward karta hai.

### Q11. Environment variables kyon use kiye?

Admin credentials aur AI API key ko source code se bahar secure rakhne ke liye.

### Q12. Project ki main limitation kya hai?

Data permanent database mein save nahi hota aur scanned image PDF ke liye OCR available nahi hai.

---

## 20. Short Presentation Speech

Namaste. Mera project AI Resume Analyzer and Job Match System hai.

Is project ka purpose resume ko job description ke saath compare karna hai. User resume PDF upload karta hai aur job description enter karta hai. Backend PDF se text extract karta hai aur important keywords ko resume mein search karta hai. Matching keywords ke basis par match score calculate hota hai.

Score local keyword algorithm se calculate hota hai, isliye result transparent hai. Optional AI service resume strengths, weaknesses aur suggestions provide karti hai. Agar AI service available na ho, to fallback explanation show hoti hai.

Frontend React mein banaya gaya hai aur backend Node.js aur Express mein. Frontend aur backend dono Netlify par deploy hain. Netlify Function Express backend ko serverless format mein run karti hai. `/api` requests redirect ke through Function tak jaati hain.

HR login ke baad admin candidate submissions, match score aur detailed analysis dekh sakta hai. Is project se resume screening fast aur easy ho jaati hai.

Thank you.
