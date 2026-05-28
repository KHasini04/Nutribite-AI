# NutriBite AI 🥗⚡

NutriBite AI is an AI-powered health and fitness copilot designed to bridge the gap between diet tracking and food delivery. By taking your daily macronutrient and caloric targets, the AI intelligently curates meals from local restaurants that perfectly align with your remaining daily goals. 

Built with the **Swiggy MCP Platform** in mind, NutriBite acts as an intelligent agent that orchestrates seamless discovery and checkout workflows for users.

## 🌟 Key Features

* **AI-Powered Meal Recommendations:** Tell the AI what you're craving, and it will find the healthiest options that fit your remaining protein, carb, and fat budgets for the day.
* **Swiggy Checkout Integration:** A sleek mock-checkout flow built to be wired directly into the **Swiggy Food MCP Server** (via the Swiggy Builders Club).
* **Gamified Social Leaderboards:** Keep yourself accountable by competing against a community of users, maintaining perfect protein streaks, and unlocking health achievements.
* **Premium UX/UI:** Designed with a vibrant, modern "Elite Glassmorphism" aesthetic, featuring smooth animations and non-blocking `react-hot-toast` notifications.
* **Order History & CSV Export:** Track your spending and macronutrient intake, and export your entire history to a CSV file for deep analysis.
* **Dashboard Analytics:** Visual progress bars and interactive charts tracking your health score, budget, and daily water intake.

## 🛠️ Tech Stack

* **Frontend:** React, Vite, TailwindCSS, Recharts, Lucide React
* **Backend:** Python, FastAPI, SQLite (Local Prototype)
* **AI Engine:** Google Gemini / LLM APIs 

## 🚀 Running Locally

This repository is split into two parts: the FastAPI backend and the React frontend. 

### 1. Start the Backend
Open a terminal in the root directory:
```bash
cd backend
python -m venv venv
# On Windows: venv\Scripts\activate
# On Mac/Linux: source venv/bin/activate
pip install -r requirements.txt
python main.py
```
*The backend will run on `http://localhost:8000`.*

### 2. Start the Frontend
Open a second terminal in the root directory:
```bash
cd frontend
npm install
npm run dev
```
*The frontend will run on `http://localhost:5173`.*

## 📈 Deployment Guide

* **Frontend:** Deploy the `frontend/` directory to **Vercel**.
* **Backend:** Deploy the `backend/` directory to **Render** or **Railway**. 
* Make sure to update the API base URL in your frontend code (`frontend/src/api/dataApi.js`) to point to your live backend URL!

---
*Built for the Swiggy Builders Club 🚀*
