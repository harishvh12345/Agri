# Banana Harvest Labour & Transport Coordination System

A full-stack platform connecting banana farmers with labour teams and transport providers, featuring AI-powered cost prediction.

##  Features

- **Farmer Dashboard**: Predict harvest costs, post harvest requests, and track bookings.
- **Labour/Transport Dashboards**: View and accept jobs based on location and capacity.
- **AI Cost Prediction**: RandomForest model trained on acres, distance, and labour count.
- **Admin Analytics**: Track system-wide bookings and model accuracy.
- **Responsive Design**: Farmer-friendly UI with large buttons and mobile compatibility.
- **Multilingual**: Support for Tamil and English.

##  Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, Lucide React, Axios, React Router.
- **Backend**: FastAPI, SQLAlchemy, JWT Auth.
- **Database**: PostgreSQL (Supabase recommended).
- **ML**: scikit-learn (RandomForestRegressor), pandas, joblib.

##  Project Structure

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

Built for Banana Farmers.
