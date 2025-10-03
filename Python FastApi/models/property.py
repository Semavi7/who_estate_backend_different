from pydantic import BaseModel, Field, validator
from typing import List, Optional, Dict, Any
from datetime import datetime
from bson import ObjectId
import json

class GeoPoint(BaseModel):
    type: str = "Point"
    coordinates: List[float]

class Location(BaseModel):
    city: str
    district: str
    neighborhood: str
    geo: GeoPoint

class PropertyBase(BaseModel):
    title: str
    description: str
    price: float
    gross: float
    net: float
    number_of_room: str
    building_age: int
    floor: int
    number_of_floors: int
    heating: str
    number_of_bathrooms: int
    kitchen: str
    balcony: int
    lift: str
    parking: str
    furnished: str
    availability: str
    dues: float
    eligible_for_loan: str
    title_deed_status: str
    property_type: str
    listing_type: str
    sub_type: Optional[str] = None
    user_id: Optional[str] = None
    user_phone: Optional[int] = None

class PropertyCreate(PropertyBase):
    location: str  # JSON string
    selected_features: Optional[str] = None  # JSON string

    @validator('location', 'selected_features', pre=True)
    def parse_json_fields(cls, v):
        if isinstance(v, str):
            try:
                return json.loads(v)
            except json.JSONDecodeError:
                return v
        return v

class PropertyUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    gross: Optional[float] = None
    net: Optional[float] = None
    number_of_room: Optional[str] = None
    building_age: Optional[int] = None
    floor: Optional[int] = None
    number_of_floors: Optional[int] = None
    heating: Optional[str] = None
    number_of_bathrooms: Optional[int] = None
    kitchen: Optional[str] = None
    balcony: Optional[int] = None
    lift: Optional[str] = None
    parking: Optional[str] = None
    furnished: Optional[str] = None
    availability: Optional[str] = None
    dues: Optional[float] = None
    eligible_for_loan: Optional[str] = None
    title_deed_status: Optional[str] = None
    property_type: Optional[str] = None
    listing_type: Optional[str] = None
    sub_type: Optional[str] = None
    user_id: Optional[str] = None
    user_phone: Optional[int] = None
    location: Optional[str] = None  # JSON string
    selected_features: Optional[str] = None  # JSON string
    existing_image_urls: Optional[str] = None  # JSON string

class PropertyInDB(PropertyBase):
    id: str = Field(..., alias="_id")
    images: List[str] = []
    location: Location
    selected_features: Dict[str, List[str]] = {}
    created_at: datetime
    updated_at: datetime

    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}

class PropertyResponse(PropertyInDB):
    user: Optional[Dict[str, Any]] = None

    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}

class PropertyQueryParams(BaseModel):
    city: Optional[str] = None
    district: Optional[str] = None
    neighborhood: Optional[str] = None
    property_type: Optional[str] = None
    listing_type: Optional[str] = None
    sub_type: Optional[str] = None
    min_price: Optional[float] = None
    max_price: Optional[float] = None
    min_net: Optional[float] = None
    max_net: Optional[float] = None
    building_age: Optional[int] = None
    floor: Optional[int] = None
    number_of_floors: Optional[int] = None
    number_of_bathrooms: Optional[int] = None
    balcony: Optional[int] = None
    dues: Optional[float] = None