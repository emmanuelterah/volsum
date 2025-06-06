# VolSum AI

> **AI-powered Medical Record Summarization & Diagnostic Dashboard**

![VolSum AI Screenshot](public/assets/web-pic.jpg)

---

## 🚀 Overview

**VolSum AI** is a modern SaaS-style web application that leverages AI to analyze, summarize, and provide diagnostic insights from medical records, lab reports, and patient symptoms.  
It features a beautiful, glassmorphic dashboard, secure authentication, and a seamless user experience for clinicians and researchers.

---

## ✨ Features

- **AI Medical Analysis:**  
  Upload or input medical history, lab results, and symptoms. Get instant, AI-powered diagnostic suggestions and research-backed insights.

- **Modern Dashboard:**  
  View statistics, recent analyses, and top conditions in a clean, responsive interface.

- **Authentication:**  
  Secure registration and login with JWT-based authentication.

- **Glassmorphism UI:**  
  Beautiful, modern design with glassy cards, gradients, and responsive layouts.

- **History & Research:**  
  All analyses are saved for future reference, with supporting literature and confidence scores.

---

## 🖥️ Tech Stack

- **Frontend:** React, CSS Modules
- **Backend:** FastAPI, SQLAlchemy, PostgreSQL, spaCy, scikit-learn
- **AI/ML:** NLP (spaCy), Naive Bayes classifier (demo), customizable for real models
- **Auth:** JWT, OAuth2
- **Dockerized:** Easy local development and deployment

---

## 📦 Getting Started

### 1. **Clone the Repository**
```bash
git clone https://github.com/yourusername/volsum-ai.git
cd volsum-ai
```

### 2. **Environment Setup**

- Copy `.env.example` to `.env` in both `/backend` and `/frontend` if needed.
- Set your database and secret keys.

### 3. **Run with Docker (Recommended)**
```bash
cd backend
docker-compose up --build
```
- Backend: [http://localhost:8000](http://localhost:8000)
- Frontend: [http://localhost:3000](http://localhost:3000)

### 4. **Manual Local Development**

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn main:app --reload
```

**Frontend:**
```bash
cd frontend
npm install
npm start
```

---

## 📝 Usage

1. **Register/Login** to your account.
2. **Input** previous medical conditions, lab reports, and symptoms.
3. **Submit** for analysis.  
   - The AI will process your input and display a detailed diagnostic summary, confidence, symptoms, and supporting research.
4. **View Dashboard** for your analysis history and statistics.

---

## 🛠️ Customization

- **AI Model:**  
  Swap out the demo classifier in `backend/main.py` for your own ML model or API.
- **UI Theme:**  
  Edit CSS in `src/styles/` for branding and color tweaks.
- **Database:**  
  Uses PostgreSQL by default, but can be configured for other SQL databases.

---

## 📁 Project Structure

```
volsum-ai/
├── backend/
│   ├── main.py
│   ├── models/
│   ├── database.py
│   ├── requirements.txt
│   └── ...
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   └── styles/
│   └── public/
│       └── assets/
└── README.md
```

---

## 🤝 Contributing

Pull requests are welcome!  
For major changes, please open an issue first to discuss what you would like to change.

---

## 📄 License

[MIT](LICENSE)

---

## 💡 Credits

- UI inspired by modern SaaS dashboards and [gitdocify](https://gitdocify.com/)
- Built with ❤️ by [Your Name] and the open-source community

---

**Ready to revolutionize medical record analysis? Start with VolSum AI!**

---
