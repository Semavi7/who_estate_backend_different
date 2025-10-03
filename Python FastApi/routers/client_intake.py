from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from typing import List
from datetime import datetime

from dependencies import get_db, get_current_user, require_role, Role
from models.client_intake import ClientIntakeCreate, ClientIntakeUpdate, ClientIntakeResponse

router = APIRouter()

@router.post("/", response_model=ClientIntakeResponse)
async def create_client_intake(
    client_data: ClientIntakeCreate,
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    client_doc = {
        **client_data.dict(),
        "created_at": datetime.utcnow()
    }
    
    result = await db.client_intakes.insert_one(client_doc)
    client_doc["_id"] = result.inserted_id
    
    return ClientIntakeResponse(**client_doc)

@router.get("/", response_model=List[ClientIntakeResponse])
async def get_all_client_intakes(
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    clients = await db.client_intakes.find().to_list(None)
    return [ClientIntakeResponse(**client) for client in clients]

@router.get("/{id}", response_model=ClientIntakeResponse)
async def get_client_intake(
    id: str,
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    client = await db.client_intakes.find_one({"_id": ObjectId(id)})
    if not client:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Client intake not found"
        )
    return ClientIntakeResponse(**client)

@router.patch("/{id}", response_model=ClientIntakeResponse)
async def update_client_intake(
    id: str,
    client_data: ClientIntakeUpdate,
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    client = await db.client_intakes.find_one({"_id": ObjectId(id)})
    if not client:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Client intake not found"
        )
    
    update_data = {k: v for k, v in client_data.dict(exclude_unset=True).items() if v is not None}
    
    if update_data:
        await db.client_intakes.update_one(
            {"_id": ObjectId(id)},
            {"$set": update_data}
        )
    
    updated_client = await db.client_intakes.find_one({"_id": ObjectId(id)})
    return ClientIntakeResponse(**updated_client)

@router.delete("/{id}")
async def delete_client_intake(
    id: str,
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    result = await db.client_intakes.delete_one({"_id": ObjectId(id)})
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Client intake not found"
        )
    
    return {"message": "Client intake deleted successfully"}