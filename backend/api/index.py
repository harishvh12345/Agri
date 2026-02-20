from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
import os
from jose import JWTError, jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta
import joblib

from .. import models, database
from ..database import engine, get_db

# Create tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Auth Config
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-for-jwt")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/login")

# Load ML Model
MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "ml", "cost_model.pkl")
model = None
if os.path.exists(MODEL_PATH):
    model = joblib.load(MODEL_PATH)

# Helper functions
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# Endpoints
@app.post("/api/register")
def register(user: dict, db: Session = Depends(get_db)):
    print(f"DEBUG: Registration payload: {user}")
    try:
        if 'phone' not in user or 'password' not in user:
            raise HTTPException(status_code=400, detail="Missing phone or password")
            
        db_user = db.query(models.User).filter(models.User.phone == user['phone']).first()
        if db_user:
            raise HTTPException(status_code=400, detail="Phone already registered")
        
        password = user['password']
            
        new_user = models.User(
            name=user.get('name', 'Unknown'),
            phone=user['phone'],
            password_hash=get_password_hash(password),
            role=user.get('role', 'farmer'),
            location=user.get('location', '')
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        return {"message": "User created successfully"}
    except HTTPException as he:
        raise he
    except Exception as e:
        print(f"DEBUG Error in register: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.phone == form_data.username).first()
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    
    access_token = create_access_token(data={"sub": user.phone, "role": user.role})
    return {"access_token": access_token, "token_type": "bearer", "role": user.role, "name": user.name}

@app.post("/api/predict-cost")
def predict_cost(data: dict):
    if not model:
        # Fallback if model not trained
        acres = data.get('acres', 0)
        dist = data.get('distance_km', 0)
        labour = data.get('labour_count', 0)
        fuel = data.get('fuel_price', 100)
        predicted = 1000 + (acres * 550) + (labour * 450) + (dist * fuel * 0.6)
    else:
        features = [[data['acres'], data['distance_km'], data['labour_count'], data['fuel_price']]]
        predicted = model.predict(features)[0]
    
    return {
        "predicted_cost": round(predicted, 2),
        "cost_breakdown": {
            "labour": round(data.get('labour_count', 0) * 450, 2),
            "transport": round(data.get('distance_km', 0) * data.get('fuel_price', 100) * 0.6, 2),
            "base": 1000
        }
    }

@app.post("/api/harvest")
def create_harvest(request: dict, db: Session = Depends(get_db)):
    print(f"DEBUG: Create harvest request: {request}")
    try:
        # In a real app, we'd get farmer_id from JWT
        new_request = models.HarvestRequest(
            farmer_id=request.get('farmer_id', 1),
            acres=request['acres'],
            distance_km=request['distance_km'],
            pickup_location=request.get('pickup_location', 'Unknown'),
            delivery_location=request.get('delivery_location', 'Unknown'),
            status="pending"
        )
        db.add(new_request)
        db.commit()
        db.refresh(new_request)
        return new_request
    except Exception as e:
        import traceback
        print(f"DEBUG Error in create_harvest: {str(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/jobs/accept/{job_id}")
def accept_labour_job(job_id: int, user_data: dict, db: Session = Depends(get_db)):
    job = db.query(models.HarvestRequest).filter(models.HarvestRequest.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    job.labour_status = "accepted"
    job.labour_id = user_data.get('user_id') # In real app, from JWT
    db.commit()
    return {"message": "Labour job accepted successfully"}

@app.post("/api/transport/accept/{job_id}")
def accept_transport_job(job_id: int, user_data: dict, db: Session = Depends(get_db)):
    job = db.query(models.HarvestRequest).filter(models.HarvestRequest.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    job.transport_status = "accepted"
    job.transport_id = user_data.get('user_id') # In real app, from JWT
    db.commit()
    return {"message": "Transport job accepted successfully"}

@app.get("/api/harvest")
def get_harvests(db: Session = Depends(get_db)):
    harvests = db.query(models.HarvestRequest).all()
    # Serialize with provider info
    result = []
    for h in harvests:
        h_dict = {
            "id": h.id,
            "acres": h.acres,
            "distance_km": h.distance_km,
            "pickup_location": h.pickup_location,
            "delivery_location": h.delivery_location,
            "status": h.status,
            "labour_status": h.labour_status,
            "transport_status": h.transport_status,
            "date": h.date.isoformat(),
            "labour_details": {
                "name": h.labour_provider.name if h.labour_provider else None,
                "phone": h.labour_provider.phone if h.labour_provider else None
            } if h.labour_id else None,
            "transport_details": {
                "name": h.transport_provider.name if h.transport_provider else None,
                "phone": h.transport_provider.phone if h.transport_provider else None
            } if h.transport_id else None
        }
        result.append(h_dict)
    return result

@app.post("/api/harvest/complete/{job_id}")
def complete_harvest(job_id: int, db: Session = Depends(get_db)):
    job = db.query(models.HarvestRequest).filter(models.HarvestRequest.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    job.status = "completed"
    db.commit()
    return {"message": "Job marked as completed"}

@app.get("/api/jobs")
def get_jobs(role: str, db: Session = Depends(get_db)):
    if role == "labour":
        return db.query(models.HarvestRequest).filter(models.HarvestRequest.labour_status == "pending").all()
    if role == "transport":
        return db.query(models.HarvestRequest).filter(models.HarvestRequest.transport_status == "pending").all()
    return db.query(models.HarvestRequest).all()

@app.get("/")
def read_root():
    return {"message": "Banana Harvest API is running"}
