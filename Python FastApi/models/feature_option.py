from pydantic import BaseModel, Field
from datetime import datetime
from bson import ObjectId
from typing import Optional

class FeatureOptionBase(BaseModel):
    category: str
    value: str

class FeatureOptionCreate(FeatureOptionBase):
    pass

class FeatureOptionUpdate(BaseModel):
    category: Optional[str] = None
    value: Optional[str] = None

class FeatureOptionInDB(FeatureOptionBase):
    id: str = Field(..., alias="_id")
    created_at: datetime
    updated_at: datetime

    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}

class FeatureOptionResponse(FeatureOptionInDB):
    pass