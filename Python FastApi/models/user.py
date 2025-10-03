from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime
from enum import Enum
from bson import ObjectId

class Role(str, Enum):
    Admin = "admin"
    Member = "member"

class UserBase(BaseModel):
    name: str
    surname: str
    email: EmailStr
    phonenumber: int
    image: Optional[str] = None

class UserCreate(UserBase):
    password: str = Field(..., min_length=6)

class UserUpdate(BaseModel):
    name: Optional[str] = None
    surname: Optional[str] = None
    email: Optional[EmailStr] = None
    phonenumber: Optional[int] = None
    image: Optional[str] = None

class UserInDB(UserBase):
    id: str = Field(..., alias="_id")
    password: str
    roles: Role = Role.Member
    created_at: datetime

    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}

class UserResponse(UserBase):
    id: str = Field(..., alias="_id")
    roles: Role
    created_at: datetime

    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}

class UpdatePasswordRequest(BaseModel):
    old_password: str
    new_password: str = Field(..., min_length=6)