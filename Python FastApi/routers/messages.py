from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from typing import List
from datetime import datetime

from dependencies import get_db, get_current_user, require_role, Role, public
from models.message import MessageCreate, MessageResponse

router = APIRouter()

@router.post("/", response_model=MessageResponse)
@public()
async def create_message(
    message_data: MessageCreate,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    message_doc = {
        **message_data.dict(),
        "created_at": datetime.utcnow()
    }
    
    result = await db.messages.insert_one(message_doc)
    message_doc["_id"] = result.inserted_id
    
    return MessageResponse(**message_doc)

@router.get("/", response_model=List[MessageResponse])
async def get_all_messages(
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    messages = await db.messages.find().to_list(None)
    return [MessageResponse(**message) for message in messages]

@router.get("/{id}", response_model=MessageResponse)
async def get_message(
    id: str,
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    message = await db.messages.find_one({"_id": ObjectId(id)})
    if not message:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Mesaj bulunamadı"
        )
    return MessageResponse(**message)

@router.delete("/{id}")
async def delete_message(
    id: str,
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user: dict = Depends(require_role(Role.Admin))
):
    result = await db.messages.delete_one({"_id": ObjectId(id)})
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Mesaj bulunamadı"
        )
    
    return {"message": "Mesaj başarı ile silindi"}

@router.patch("/{id}", response_model=MessageResponse)
async def mark_message_as_read(
    id: str,
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    message = await db.messages.find_one({"_id": ObjectId(id)})
    if not message:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Mesaj bulunamadı"
        )
    
    await db.messages.update_one(
        {"_id": ObjectId(id)},
        {"$set": {"isread": True}}
    )
    
    updated_message = await db.messages.find_one({"_id": ObjectId(id)})
    return MessageResponse(**updated_message)