from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

import models, schemas, database
from database import engine, get_db

# Create tables in MySQL
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Pick A Childcare API")

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Pick A Childcare API"}

# --- PROVIDERS ---

@app.get("/providers", response_model=List[schemas.Provider])
def get_providers(db: Session = Depends(get_db)):
    return db.query(models.Provider).all()

@app.get("/providers/{provider_id}", response_model=schemas.Provider)
def get_provider(provider_id: int, db: Session = Depends(get_db)):
    db_provider = db.query(models.Provider).filter(models.Provider.id == provider_id).first()
    if db_provider is None:
        raise HTTPException(status_code=44, detail="Provider not found")
    return db_provider

# --- AGENCIES ---

@app.get("/agencies", response_model=List[schemas.Agency])
def get_agencies(db: Session = Depends(get_db)):
    return db.query(models.Agency).all()

# --- WAITLIST ---

@app.post("/waitlist", response_model=schemas.WaitlistEntry)
def create_waitlist_entry(entry: schemas.WaitlistEntryCreate, db: Session = Depends(get_db)):
    # Check if provider exists
    db_provider = db.query(models.Provider).filter(models.Provider.id == entry.provider_id).first()
    if not db_provider:
        raise HTTPException(status_code=400, detail="Invalid provider ID")
    
    db_entry = models.WaitlistEntry(**entry.model_dump())
    db.add(db_entry)
    db.commit()
    db.refresh(db_entry)
    return db_entry

@app.get("/waitlist", response_model=List[schemas.WaitlistEntry])
def get_waitlist(db: Session = Depends(get_db)):
    return db.query(models.WaitlistEntry).all()