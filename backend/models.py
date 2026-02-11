from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, JSON, DateTime
from sqlalchemy.orm import relationship
from database import Base
import datetime

class Agency(Base):
    __tablename__ = "agencies"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), unique=True, index=True)
    phone = Column(String(50))
    email = Column(String(255))

    providers = relationship("Provider", back_populates="agency")

class Provider(Base):
    __tablename__ = "providers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), index=True)
    type = Column(String(100))
    rating = Column(Float, default=0.0)
    reviews = Column(Integer, default=0)
    location = Column(String(100))
    spots_available = Column(Integer, default=0)
    max_capacity = Column(Integer, default=0)
    ages_served = Column(JSON)  # List of strings
    meals_provided = Column(Boolean, default=False)
    snack_provided = Column(Boolean, default=False)
    registered_with_city = Column(Boolean, default=False)
    image = Column(String(500))
    tags = Column(JSON)  # List of strings
    description = Column(String(1000))
    
    agency_id = Column(Integer, ForeignKey("agencies.id"), nullable=True)
    agency = relationship("Agency", back_populates="providers")
    
    waitlist_entries = relationship("WaitlistEntry", back_populates="provider")

class WaitlistEntry(Base):
    __tablename__ = "waitlist"

    id = Column(Integer, primary_key=True, index=True)
    parent_names = Column(String(255))
    child_name = Column(String(255))
    child_age = Column(String(100))
    dob_or_due_date = Column(String(100))
    desired_start_month = Column(String(50))
    desired_start_year = Column(Integer)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

    provider_id = Column(Integer, ForeignKey("providers.id"))
    provider = relationship("Provider", back_populates="waitlist_entries")