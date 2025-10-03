from pydantic import BaseModel, Field, EmailStr
from datetime import datetime
from bson import ObjectId
from typing import Optional

class MessageBase(BaseModel):
    name: str
    surname: str
    email: EmailStr
    phone: int
    message: str
    isread: bool = False

class MessageCreate(MessageBase):
    pass

class MessageInDB(MessageBase):
    id: str = Field(..., alias="_id")
    created_at: datetime

    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}

class MessageResponse(MessageInDB):
    pass