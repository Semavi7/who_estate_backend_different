from pydantic import BaseModel, Field
from datetime import datetime
from bson import ObjectId

class ResetTokenBase(BaseModel):
    token_hash: str
    user_id: str
    expires: datetime
    used_at: Optional[datetime] = None

class ResetTokenCreate(ResetTokenBase):
    pass

class ResetTokenInDB(ResetTokenBase):
    id: str = Field(..., alias="_id")

    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}

class ResetTokenResponse(ResetTokenBase):
    id: str = Field(..., alias="_id")

    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}