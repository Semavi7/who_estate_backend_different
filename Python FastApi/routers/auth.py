from fastapi import APIRouter, Depends, HTTPException, status, Response, Body
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime, timedelta
import jwt
from passlib.context import CryptContext
import os
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId

from dependencies import get_db, get_current_user
from models.user import User
from models.reset_token import ResetToken

router = APIRouter()

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT settings
SECRET_KEY = os.getenv("JWT_SECRET", "your-secret-key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class LoginResponse(BaseModel):
    access_token: str
    email: str
    _id: str
    name: str
    surname: str
    phonenumber: int
    role: str
    image: str

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str
    newPassword: str

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def authenticate_user(email: str, password: str, db: AsyncIOMotorDatabase):
    user = await db.users.find_one({"email": email})
    if not user:
        return False
    if not verify_password(password, user["password"]):
        return False
    return user

@router.post("/login", response_model=LoginResponse)
async def login(
    response: Response,
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    user = await authenticate_user(form_data.username, form_data.password, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user["_id"]), "email": user["email"], "roles": user["roles"]},
        expires_delta=access_token_expires
    )
    
    # Set cookie
    response.set_cookie(
        key="accessToken",
        value=access_token,
        httponly=True,
        secure=os.getenv("NODE_ENV") == "production",
        samesite="none" if os.getenv("NODE_ENV") == "production" else "strict",
        max_age=60 * 60,
        path="/",
        domain=".onlineticariotomasyon.org.tr" if os.getenv("NODE_ENV") == "production" else ""
    )
    
    return LoginResponse(
        access_token=access_token,
        email=user["email"],
        _id=str(user["_id"]),
        name=user["name"],
        surname=user["surname"],
        phonenumber=user["phonenumber"],
        role=user["roles"],
        image=user.get("image", "")
    )

@router.post("/forgot-password")
async def forgot_password(
    request: ForgotPasswordRequest,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    user = await db.users.find_one({"email": request.email})
    generic_message = "Eğer bu e-posta sistemimizde kayıtlı ise, şifre sıfırlama bağlantısı gönderildi."
    
    if not user:
        return {"message": generic_message}
    
    # Generate reset token logic here (to be implemented with mail service)
    # For now, just return the generic message
    return {"message": generic_message}

@router.post("/reset-password")
async def reset_password(
    request: ResetPasswordRequest,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    # Reset password logic here (to be implemented with token validation)
    # For now, just return success message
    return {"message": "Şifre başarıyla güncellendi"}