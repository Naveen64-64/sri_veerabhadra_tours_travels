"""
Destination Pydantic schemas.
"""
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class DestinationCreate(BaseModel):
    name: str = Field(..., min_length=1)
    description: str = ""
    tourInfo: str = ""
    category: str = "temple"
    image: str = ""
    isActive: bool = True


class DestinationUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    tourInfo: Optional[str] = None
    category: Optional[str] = None
    image: Optional[str] = None
    isActive: Optional[bool] = None


class DestinationResponse(BaseModel):
    id: str = Field(..., alias="_id")
    name: str
    description: str
    tourInfo: str
    category: str
    image: str
    isActive: bool
    createdAt: Optional[datetime] = None
    updatedAt: Optional[datetime] = None

    class Config:
        populate_by_name = True
