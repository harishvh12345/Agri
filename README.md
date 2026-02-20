# Banana Harvest Labour & Transport Coordination System

A full-stack platform connecting banana farmers with labour teams and transport providers, featuring AI-powered cost prediction.

## 🚀 Features

- **Farmer Dashboard**: Predict harvest costs, post harvest requests, and track bookings.
- **Labour/Transport Dashboards**: View and accept jobs based on location and capacity.
- **AI Cost Prediction**: RandomForest model trained on acres, distance, and labour count.
- **Admin Analytics**: Track system-wide bookings and model accuracy.
- **Responsive Design**: Farmer-friendly UI with large buttons and mobile compatibility.
- **Multilingual**: Support for Tamil and English.

## 🛠️ Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, Lucide React, Axios, React Router.
- **Backend**: FastAPI, SQLAlchemy, JWT Auth.
- **Database**: PostgreSQL (Supabase recommended).
- **ML**: scikit-learn (RandomForestRegressor), pandas, joblib.

## 📦 Project Structure

```bash
banana-app/
├── frontend/          # React (Vite) application
├── backend/
│   ├── api/           # FastAPI app (index.py)
│   ├── ml/            # ML training and model (cost_model.pkl)
│   ├── models.py      # SQLAlchemy models
│   └── database.py    # DB connection
├── vercel.json        # Vercel deployment config
└── README.md
```

## ⚙️ Setup & Deployment

### Local Development

1. **Backend**:
   ```bash
   cd backend
   pip install -r requirements.txt
   python ml/train_model.py  # Train the ML model
   uvicorn api.index:app --reload
   ```

2. **Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

### Vercel Deployment

1. **Connect Repository**: Link your GitHub repo to Vercel.
2. **Environment Variables**: Add `DATABASE_URL` (Supabase link) and `SECRET_KEY` in Vercel settings.
3. **Deploy**: Run `vercel deploy` or push to main.

## 📊 ML Model

The cost prediction uses a `RandomForestRegressor`.
- **Inputs**: Acres, Distance (km), Labour Count, Fuel Price.
- **Outputs**: Total estimated cost and breakdown.
- **Accuracy**: High precision simulation based on historical harvest patterns.

## 📜 Seed Data

Run `python backend/ml/train_model.py` to generate the initial model and synthetic dataset for simulation.

---
Built for Banana Farmers. 🍌🚜
