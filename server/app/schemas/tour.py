"""
Tour Pydantic schemas.
"""
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class TourCreate(BaseModel):
    name: str = Field(..., min_length=1)
    startLocation: str = ""
    destination: str = ""
    duration: str = ""
    places: List[str] = []
    busInfo: str = ""
    price: float = Field(default=0, ge=0)
    description: str = ""
    image: str = ""
    isDemo: bool = False
    isActive: bool = True


class TourUpdate(BaseModel):
    name: Optional[str] = None
    startLocation: Optional[str] = None
    destination: Optional[str] = None
    duration: Optional[str] = None
    places: Optional[List[str]] = None
    busInfo: Optional[str] = None
    price: Optional[float] = None
    description: Optional[str] = None
    image: Optional[str] = None
    isDemo: Optional[bool] = None
    isActive: Optional[bool] = None


class TourResponse(BaseModel):
    id: str = Field(..., alias="_id")
    name: str
    startLocation: str
    destination: str
    duration: str
    places: List[str]
    busInfo: str
    price: float
    description: str
    image: str
    isDemo: bool
    isActive: bool
    createdAt: Optional[datetime] = None
    updatedAt: Optional[datetime] = None

    class Config:
        populate_by_name = True
