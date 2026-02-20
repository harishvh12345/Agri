from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Enum
from sqlalchemy.orm import relationship
from .database import Base
import enum
import datetime

class UserRole(str, enum.Enum):
    FARMER = "farmer"
    LABOUR = "labour"
    TRANSPORT = "transport"
    ADMIN = "admin"

class BookingStatus(str, enum.Enum):
    PENDING = "pending"
    ACCEPTED = "accepted"
    REJECTED = "rejected"
    COMPLETED = "completed"

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    phone = Column(String, unique=True, index=True)
    password_hash = Column(String)
    role = Column(String) # farmer, labour, transport, admin
    location = Column(String)

class HarvestRequest(Base):
    __tablename__ = "harvest_requests"
    id = Column(Integer, primary_key=True, index=True)
    farmer_id = Column(Integer, ForeignKey("users.id"))
    acres = Column(Float)
    distance_km = Column(Float)
    pickup_location = Column(String)
    delivery_location = Column(String)
    date = Column(DateTime, default=datetime.datetime.utcnow)
    status = Column(String, default="pending") # pending, completed
    labour_status = Column(String, default="pending") # pending, accepted
    transport_status = Column(String, default="pending") # pending, accepted
    labour_id = Column(Integer, ForeignKey("users.id"), nullable=True) # The labour team user who accepted
    transport_id = Column(Integer, ForeignKey("users.id"), nullable=True) # The transport provider user who accepted

    labour_provider = relationship("User", foreign_keys=[labour_id])
    transport_provider = relationship("User", foreign_keys=[transport_id])
    farmer = relationship("User", foreign_keys=[farmer_id])

class LabourTeam(Base):
    __tablename__ = "labour_teams"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    team_size = Column(Integer)
    location = Column(String)

class Vehicle(Base):
    __tablename__ = "vehicles"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    vehicle_type = Column(String)
    capacity = Column(Float)

class Booking(Base):
    __tablename__ = "bookings"
    id = Column(Integer, primary_key=True, index=True)
    request_id = Column(Integer, ForeignKey("harvest_requests.id"))
    labour_id = Column(Integer, ForeignKey("labour_teams.id"), nullable=True)
    vehicle_id = Column(Integer, ForeignKey("vehicles.id"), nullable=True)
    total_cost = Column(Float)
    status = Column(String, default="pending")
