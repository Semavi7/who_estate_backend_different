from pydantic import BaseModel, Field
from bson import ObjectId

class TrackViewBase(BaseModel):
    date: str
    views: int

class TrackViewCreate(TrackViewBase):
    pass

class TrackViewInDB(TrackViewBase):
    id: str = Field(..., alias="_id")

    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}

class TrackViewResponse(TrackViewInDB):
    pass

class MonthlyStats(BaseModel):
    month: str
    views: int