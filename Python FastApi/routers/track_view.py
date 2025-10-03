from fastapi import APIRouter, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List
from datetime import datetime

from dependencies import get_db, public
from models.track_view import TrackViewResponse, MonthlyStats

router = APIRouter()

@router.post("/", response_model=TrackViewResponse)
@public()
async def create_track_view(db: AsyncIOMotorDatabase = Depends(get_db)):
    today = datetime.now().strftime("%Y-%m-%d")
    
    # Check if there's already a record for today
    existing_track = await db.track_views.find_one({"date": today})
    
    if existing_track:
        # Increment view count
        await db.track_views.update_one(
            {"date": today},
            {"$inc": {"views": 1}}
        )
        updated_track = await db.track_views.find_one({"date": today})
        return TrackViewResponse(**updated_track)
    else:
        # Create new record
        track_doc = {
            "date": today,
            "views": 1
        }
        result = await db.track_views.insert_one(track_doc)
        track_doc["_id"] = result.inserted_id
        return TrackViewResponse(**track_doc)

@router.get("/", response_model=List[MonthlyStats])
@public()
async def get_current_year_stats(db: AsyncIOMotorDatabase = Depends(get_db)):
    current_year = datetime.now().year
    
    pipeline = [
        {
            "$match": {
                "date": {"$regex": f"^{current_year}-"}
            }
        },
        {
            "$group": {
                "_id": {"$substr": ["$date", 0, 7]},  # "YYYY-MM"
                "views": {"$sum": "$views"}
            }
        },
        {"$sort": {"_id": 1}}
    ]
    
    result = await db.track_views.aggregate(pipeline).to_list(None)
    
    # Fill in missing months with zero views
    months = []
    for month in range(1, 13):
        month_str = f"{current_year}-{month:02d}"
        month_data = next((item for item in result if item["_id"] == month_str), None)
        months.append({
            "month": month_str,
            "views": month_data["views"] if month_data else 0
        })
    
    return months

@router.get("/month")
@public()
async def get_current_month_total_views(db: AsyncIOMotorDatabase = Depends(get_db)):
    current_month = datetime.now().strftime("%Y-%m")
    
    pipeline = [
        {
            "$match": {
                "date": {"$regex": f"^{current_month}"}
            }
        },
        {
            "$group": {
                "_id": None,
                "totalViews": {"$sum": "$views"}
            }
        }
    ]
    
    result = await db.track_views.aggregate(pipeline).to_list(None)
    
    return result[0]["totalViews"] if result else 0