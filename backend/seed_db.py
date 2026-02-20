from sqlalchemy.orm import Session
from .database import SessionLocal, engine
from . import models
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

def get_password_hash(password):
    return pwd_context.hash(password)

def seed():
    db = SessionLocal()
    # Create tables if not exist
    models.Base.metadata.create_all(bind=engine)

    # Test Users
    users = [
        {
            "name": "Arun Farmer",
            "phone": "9876543210",
            "password": "password123",
            "role": "farmer",
            "location": "Madurai"
        },
        {
            "name": "Selvam Labour Team",
            "phone": "9876543211",
            "password": "password123",
            "role": "labour",
            "location": "Theni"
        },
        {
            "name": "Kumar Transport",
            "phone": "9876543212",
            "password": "password123",
            "role": "transport",
            "location": "Dindigul"
        },
        {
            "name": "System Admin",
            "phone": "9999999999",
            "password": "adminpassword",
            "role": "admin",
            "location": "Chennai"
        }
    ]

    for user_data in users:
        db_user = db.query(models.User).filter(models.User.phone == user_data["phone"]).first()
        if not db_user:
            new_user = models.User(
                name=user_data["name"],
                phone=user_data["phone"],
                password_hash=get_password_hash(user_data["password"]),
                role=user_data["role"],
                location=user_data["location"]
            )
            db.add(new_user)
            print(f"Created user: {user_data['name']} ({user_data['role']})")
    
    db.commit()
    db.close()

if __name__ == "__main__":
    seed()
