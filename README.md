
# AI Tailored Cover Letter Generator 📝✨

This is a full-stack web application that uses OpenAI to generate personalized cover letters, CV improvement suggestions, and job-specific application tips — all powered by your uploaded PDFs and job description links.

---

## 🧠 Features

- Upload **past cover letters (PDFs)** to learn your writing style.
- Upload a **CSV file with job URLs** to pull real job descriptions.
- Generates:
  - ✅ Tailored cover letter
  - 📌 Resume improvement suggestions
  - 🚀 Personalized application tips

---

## 📁 Folder Structure

```
cover-letter-webapp/
├── backend/         # Node.js + Express server
├── frontend/        # React + Vite + Tailwind frontend
```

---

## ⚙️ How to Run Locally

### 🔹 1. Backend Setup

```bash
cd cover-letter-webapp/backend
npm install
node server.js
```

> Make sure to add your OpenAI API key inside `.env`:

```
OPENAI_API_KEY=your-real-openai-key-here
```

### 🔹 2. Frontend Setup

```bash
cd cover-letter-webapp/frontend
npm install
npm run dev
```

Now visit: [http://localhost:3000](http://localhost:3000)

---

## 🚀 Deployment Guide

### 🌐 Deploy Frontend (Vercel)
- Go to https://vercel.com
- Import the GitHub repo
- Set root directory to `frontend/`
- Build Command: `npm run build`
- Output Directory: `dist`

### 🔧 Deploy Backend (Render)
- Go to https://render.com
- Create new **Web Service**
- Connect GitHub → Select `backend/` directory
- Set Build Command: `npm install`
- Set Start Command: `node server.js`
- Add Environment Variable:
  - `OPENAI_API_KEY = your-real-api-key`

---

## 📦 Push to GitHub

```bash
git init
git remote add origin https://github.com/YOUR_USERNAME/cover-letter-webapp.git
git add .
git commit -m "Initial commit"
git push -u origin master
```

---

## 🧪 Sample CSV Format

```csv
url
https://example.com/job-post-1
https://anotherjob.com/posting-2
```

---

## 💡 License

MIT License — Use it freely, improve it creatively!

---

Built with ❤️ using OpenAI, React, Node, and Vite.
