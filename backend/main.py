from fastapi import FastAPI, HTTPException, Depends, status, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import List, Optional, Any
import os
from dotenv import load_dotenv
import spacy
from datetime import timedelta, datetime
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
import numpy as np
import logging

from database import get_db, User as DBUser, engine, Base
from models.auth import UserCreate, Token, User, TokenData
from utils.auth import (
    verify_password,
    get_password_hash,
    create_access_token,
    get_current_active_user,
    ACCESS_TOKEN_EXPIRE_MINUTES,
    verify_token
)
from config import get_settings
from models.analysis import AnalysisResult

# Load environment variables
load_dotenv()

# Create database tables
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(title="VolSum API")
settings = get_settings()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize spaCy
nlp = spacy.load("en_core_web_sm")

# Dummy classifier for demo purposes
vectorizer = TfidfVectorizer()
classifier = MultinomialNB()

# Dummy training data (replace with real data later)
dummy_symptoms = [
    "fever cough shortness of breath",
    "headache nausea vomiting",
    "chest pain fatigue dizziness"
]
dummy_conditions = ["respiratory", "gastrointestinal", "cardiac"]

# Fit the classifier
X = vectorizer.fit_transform(dummy_symptoms)
classifier.fit(X, dummy_conditions)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class PatientRecord(BaseModel):
    text: str
    current_diagnosis: Optional[str] = None

class AnalysisRequest(BaseModel):
    record: str

class Citation(BaseModel):
    title: str
    authors: str
    journal: str
    year: int

class ResearchSupport(BaseModel):
    description: str
    citations: list[Citation]

class RichAnalysisResponse(BaseModel):
    mismatchProbability: int
    suggestedDiagnosis: str
    confidence: int
    symptoms: list[str]
    research: ResearchSupport

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class AnalysisCreate(BaseModel):
    record_text: str
    entities: Any
    user_id: Optional[int] = None

class AnalysisOut(BaseModel):
    id: int
    user_id: Optional[int]
    record_text: str
    entities: Any
    created_at: datetime

    class Config:
        from_attributes = True

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

async def get_current_user_id(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    payload = verify_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials"
        )
    email = payload.get("sub")
    if email is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials"
        )
    user = db.query(DBUser).filter(DBUser.email == email).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return user.id

def detect_severity(text: str) -> str:
    text_lower = text.lower()
    if "severe" in text_lower or "critical" in text_lower:
        return "severe"
    elif "mild" in text_lower or "slight" in text_lower:
        return "mild"
    else:
        return "moderate"

@app.post("/analyze", response_model=RichAnalysisResponse)
def analyze_record(request: AnalysisRequest):
    try:
        logger.info(f"Analyzing record: {request.record}")
        doc = nlp(request.record)
        # Extract symptoms (for demo, use noun chunks and entities)
        symptoms = list(set([chunk.text for chunk in doc.noun_chunks] + [ent.text for ent in doc.ents]))
        # Dummy logic for diagnosis and confidence
        suggested_diagnosis = "Multiple Sclerosis" if "vision" in request.record.lower() else "Hypertension"
        confidence = 92 if suggested_diagnosis == "Multiple Sclerosis" else 80
        mismatch_probability = 85 if suggested_diagnosis == "Multiple Sclerosis" else 30
        research = ResearchSupport(
            description=(
                "Based on the patient's symptoms and medical history, there is a high probability of "
                f"{suggested_diagnosis}. The pattern of symptoms strongly suggests this diagnosis."
            ),
            citations=[
                Citation(
                    title="Diagnostic Criteria for Multiple Sclerosis",
                    authors="Thompson et al.",
                    journal="Neurology",
                    year=2018
                ),
                Citation(
                    title="Early Symptoms of MS",
                    authors="Smith & Johnson",
                    journal="Journal of Neurology",
                    year=2020
                )
            ]
        )
        return RichAnalysisResponse(
            mismatchProbability=mismatch_probability,
            suggestedDiagnosis=suggested_diagnosis,
            confidence=confidence,
            symptoms=symptoms,
            research=research
        )
    except Exception as e:
        logger.error(f"Error analyzing record: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}

@app.post("/auth/register", response_model=Token)
def register(user: UserCreate, db: Session = Depends(get_db)):
    # Check if user already exists
    db_user = db.query(DBUser).filter(DBUser.email == user.email).first()
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    hashed_password = get_password_hash(user.password)
    db_user = DBUser(email=user.email, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # Create access token
    access_token = create_access_token(
        data={"sub": user.email}
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/auth/login", response_model=Token)
def login(user: UserLogin, db: Session = Depends(get_db)):
    # Verify user exists
    db_user = db.query(DBUser).filter(DBUser.email == user.email).first()
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    # Verify password
    if not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    # Create access token
    access_token = create_access_token(
        data={"sub": user.email}
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/auth/me", response_model=User)
async def read_users_me(current_user: DBUser = Depends(get_current_active_user)):
    return current_user

# Protected route example
@app.get("/api/protected")
async def protected_route(current_user: DBUser = Depends(get_current_active_user)):
    return {"message": "This is a protected route", "user": current_user.email}

@app.get("/users/me")
def read_users_me_token(token: str, db: Session = Depends(get_db)):
    payload = verify_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials"
        )
    
    email = payload.get("sub")
    if email is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials"
        )
    
    user = db.query(DBUser).filter(DBUser.email == email).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return {"email": user.email}

@app.post("/analysis", response_model=AnalysisOut)
def create_analysis(analysis: AnalysisCreate, user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)):
    try:
        logger.info(f"Creating analysis for user {user_id}")
        db_analysis = AnalysisResult(
            user_id=user_id,
            record_text=analysis.record_text,
            entities=analysis.entities
        )
        db.add(db_analysis)
        db.commit()
        db.refresh(db_analysis)
        logger.info(f"Analysis created with ID: {db_analysis.id}")
        return db_analysis
    except SQLAlchemyError as e:
        db.rollback()
        logger.error(f"Database error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/analysis", response_model=List[AnalysisOut])
def get_analyses(user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)):
    try:
        logger.info(f"Fetching analyses for user {user_id}")
        return db.query(AnalysisResult).filter(AnalysisResult.user_id == user_id).order_by(AnalysisResult.created_at.desc()).all()
    except SQLAlchemyError as e:
        logger.error(f"Database error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e)) 