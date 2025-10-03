from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from typing import List, Dict
from datetime import datetime

from dependencies import get_db, get_current_user, require_role, Role, public
from models.feature_option import FeatureOptionCreate, FeatureOptionUpdate, FeatureOptionResponse

router = APIRouter()

@router.post("/", response_model=FeatureOptionResponse)
async def create_feature_option(
    feature_data: FeatureOptionCreate,
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    # Check for duplicate
    existing_option = await db.feature_options.find_one({
        "category": feature_data.category,
        "value": feature_data.value
    })
    if existing_option:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Bu özellik zaten mevcut."
        )
    
    feature_doc = {
        **feature_data.dict(),
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    result = await db.feature_options.insert_one(feature_doc)
    feature_doc["_id"] = result.inserted_id
    
    return FeatureOptionResponse(**feature_doc)

@router.get("/", response_model=Dict[str, List[str]])
@public()
async def get_all_feature_options_grouped(db: AsyncIOMotorDatabase = Depends(get_db)):
    options = await db.feature_options.find().to_list(None)
    
    grouped_options = {}
    for option in options:
        category = option["category"]
        value = option["value"]
        if category not in grouped_options:
            grouped_options[category] = []
        grouped_options[category].append(value)
    
    return grouped_options

@router.get("/findall", response_model=List[FeatureOptionResponse])
async def get_all_feature_options(
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    options = await db.feature_options.find().to_list(None)
    return [FeatureOptionResponse(**option) for option in options]

@router.get("/{id}", response_model=FeatureOptionResponse)
async def get_feature_option(
    id: str,
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    option = await db.feature_options.find_one({"_id": ObjectId(id)})
    if not option:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Özellik bulunamadı"
        )
    return FeatureOptionResponse(**option)

@router.put("/{id}", response_model=FeatureOptionResponse)
async def update_feature_option(
    id: str,
    feature_data: FeatureOptionUpdate,
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    option = await db.feature_options.find_one({"_id": ObjectId(id)})
    if not option:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Özellik bulunamadı"
        )
    
    # Check for potential duplicate
    update_category = feature_data.category or option["category"]
    update_value = feature_data.value or option["value"]
    
    if feature_data.category or feature_data.value:
        potential_duplicate = await db.feature_options.find_one({
            "category": update_category,
            "value": update_value,
            "_id": {"$ne": ObjectId(id)}
        })
        if potential_duplicate:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Güncelleme sonucunda başka bir özellikle aynı olacak. Lütfen farklı bir değer girin."
            )
    
    update_data = {k: v for k, v in feature_data.dict(exclude_unset=True).items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    if update_data:
        await db.feature_options.update_one(
            {"_id": ObjectId(id)},
            {"$set": update_data}
        )
    
    updated_option = await db.feature_options.find_one({"_id": ObjectId(id)})
    return FeatureOptionResponse(**updated_option)

@router.delete("/{id}")
async def delete_feature_option(
    id: str,
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    result = await db.feature_options.delete_one({"_id": ObjectId(id)})
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Özellik bulunamadı"
        )
    
    return {"message": "Özellik başarı ile silindi"}