from pydantic import BaseModel, Field
from datetime import datetime
from bson import ObjectId

class ClientIntakeBase(BaseModel):
    namesurname: str
    description: str
    phone: int

class ClientIntakeCreate(ClientIntakeBase):
    pass

class ClientIntakeUpdate(BaseModel):
    namesurname: Optional[str] = None
    description: Optional[str] = None
    phone: Optional[int] = None

class ClientIntakeInDB(ClientIntakeBase):
    id: str = Field(..., alias="_id")
    created_at: datetime

    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}

class ClientIntakeResponse(ClientIntakeInDB):
    pass