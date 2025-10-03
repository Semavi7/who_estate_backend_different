from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import MongoClient
import os
from dotenv import load_dotenv
from contextlib import asynccontextmanager

# Import routers
from routers.auth import router as auth_router
from routers.user import router as user_router
from routers.properties import router as properties_router
from routers.client_intake import router as client_intake_router
from routers.feature_options import router as feature_options_router
from routers.messages import router as messages_router
from routers.track_view import router as track_view_router

# Load environment variables
load_dotenv()

# MongoDB connection
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "who_estate")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Connect to MongoDB
    app.mongodb_client = AsyncIOMotorClient(MONGO_URL)
    app.mongodb = app.mongodb_client[DATABASE_NAME]
    yield
    # Shutdown: Close MongoDB connection
    app.mongodb_client.close()

app = FastAPI(
    title="Who Estate API",
    description="Real estate management API built with FastAPI",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://app.onlineticariotomasyon.org.tr"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

# Include routers
app.include_router(auth_router, prefix="/auth", tags=["Authentication"])
app.include_router(user_router, prefix="/user", tags=["Users"])
app.include_router(properties_router, prefix="/properties", tags=["Properties"])
app.include_router(client_intake_router, prefix="/client-intake", tags=["Client Intake"])
app.include_router(feature_options_router, prefix="/feature-options", tags=["Feature Options"])
app.include_router(messages_router, prefix="/messages", tags=["Messages"])
app.include_router(track_view_router, prefix="/track-view", tags=["Track View"])

@app.get("/")
async def root():
    return {"message": "Who Estate API is running!"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "database": "connected"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=3001)