<img width="1908" height="855" alt="image" src="https://github.com/user-attachments/assets/45453747-db81-493a-9970-815958e8c936" />


# 🧠 AI Medical Research Assistant

An AI-powered medical research assistant that combines real-time data from multiple medical databases with intelligent reasoning to provide structured, context-aware insights.

---

## 🚀 Problem Statement

Doctors and patients often struggle to quickly access reliable, research-backed medical insights from multiple sources like journals and clinical trials.

---

## 💡 Solution

We built a **retrieval-augmented medical assistant** that:

- Fetches real-time data from:
  - OpenAlex (research papers)
  - PubMed (medical literature)
  - ClinicalTrials.gov (clinical trials)
- Processes and filters large datasets
- Uses an LLM to generate structured, meaningful insights

---

## 🔥 Features

- 💬 Chat-based medical assistant  
- 🔍 Multi-source research retrieval  
- 📊 Structured AI responses (Overview + Insights)  
- 🧪 Clinical trials integration  
- 🧠 Context-aware conversation (multi-turn queries)  
- 👤 Patient-specific query expansion  
- 📂 Chat history & multiple conversations  
- 🎤 Voice input support (browser-based)  
- 📎 File input UI support  

---

## 🏗️ Architecture
User Input
↓
Query Expansion (Patient Context)
↓
Multi-Source Retrieval
(OpenAlex + PubMed + ClinicalTrials)
↓
Filtering & Ranking
↓
LLM Processing (OpenRouter)
↓
Structured Response
↓
Frontend Display (Chat + Research Panel)


---

## 🛠️ Tech Stack

### Frontend
- React.js
- Tailwind CSS

### Backend
- Node.js
- Express.js

### APIs
- OpenAlex API
- PubMed API (NCBI)
- ClinicalTrials.gov API

### AI
- OpenRouter (LLM for summarization)

---

## 📦 Project Structure
client/
├── components/
├── pages/
├── App.jsx

server/
├── services/
│ ├── openalex.js
│ ├── pubmed.js
│ ├── trials.js
├── routes/
├── server.js


---

## ⚙️ Installation & Setup

### 1. Clone Repository

```bash
git clone <your-repo-link>
cd project-folder

2. Frontend Setup
cd client
npm install
npm run dev

3. Backend Setup
cd server
npm install
node server.js
