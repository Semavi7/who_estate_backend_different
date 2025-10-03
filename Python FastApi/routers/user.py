from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from fastapi.responses import JSONResponse
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from typing import List, Optional
import os

from dependencies import get_db, get_current_user, require_role, Role, public
from models.user import UserCreate, UserUpdate, UserResponse, UpdatePasswordRequest
from routers.auth import get_password_hash, verify_password

router = APIRouter()

@router.post("/", response_model=UserResponse)
async def create_user(
    user_data: UserCreate,
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user: dict = Depends(require_role(Role.Admin))
):
    # Check if user already exists
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists"
        )
    
    # Hash password
    hashed_password = get_password_hash(user_data.password)
    
    # Create user document
    user_doc = {
        "name": user_data.name,
        "surname": user_data.surname,
        "email": user_data.email,
        "phonenumber": user_data.phonenumber,
        "password": hashed_password,
        "roles": Role.Member.value,
        "image": user_data.image or "",
        "created_at": datetime.utcnow()
    }
    
    result = await db.users.insert_one(user_doc)
    user_doc["_id"] = result.inserted_id
    
    return UserResponse(**user_doc)

@router.patch("/{id}/upload-image")
async def upload_user_image(
    id: str,
    image: UploadFile = File(...),
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    # Check if user exists
    user = await db.users.find_one({"_id": ObjectId(id)})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # File upload logic here (to be implemented with file upload service)
    # For now, just return a placeholder URL
    image_url = f"https://example.com/images/{id}/{image.filename}"
    
    # Update user with image URL
    await db.users.update_one(
        {"_id": ObjectId(id)},
        {"$set": {"image": image_url}}
    )
    
    return {"image_url": image_url}

@router.get("/", response_model=List[UserResponse])
@public()
async def get_all_users(db: AsyncIOMotorDatabase = Depends(get_db)):
    users = await db.users.find().to_list(None)
    return [UserResponse(**user) for user in users]

@router.get("/{id}", response_model=UserResponse)
async def get_user(
    id: str,
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    user = await db.users.find_one({"_id": ObjectId(id)})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return UserResponse(**user)

@router.put("/{id}", response_model=UserResponse)
async def update_user(
    id: str,
    user_data: UserUpdate,
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    # Check if user exists
    user = await db.users.find_one({"_id": ObjectId(id)})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Update only provided fields
    update_data = {k: v for k, v in user_data.dict(exclude_unset=True).items() if v is not None}
    
    if update_data:
        await db.users.update_one(
            {"_id": ObjectId(id)},
            {"$set": update_data}
        )
    
    # Return updated user
    updated_user = await db.users.find_one({"_id": ObjectId(id)})
    return UserResponse(**updated_user)

@router.delete("/{id}")
async def delete_user(
    id: str,
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user: dict = Depends(require_role(Role.Admin))
):
    result = await db.users.delete_one({"_id": ObjectId(id)})
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return {"message": "User deleted successfully"}

@router.patch("/{id}/password")
async def update_password(
    id: str,
    password_data: UpdatePasswordRequest,
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    # Check if user exists
    user = await db.users.find_one({"_id": ObjectId(id)})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Verify old password
    if not verify_password(password_data.old_password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect old password"
        )
    
    # Hash new password
    hashed_password = get_password_hash(password_data.new_password)
    
    # Update password
    await db.users.update_one(
        {"_id": ObjectId(id)},
        {"$set": {"password": hashed_password}}
    )
    
    return {"message": "Password updated successfully"}

# Add missing import
from datetime import datetime