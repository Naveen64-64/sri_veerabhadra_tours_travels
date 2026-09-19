"""
Route Pydantic schemas.
"""
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class RouteCreate(BaseModel):
    fromLocation: str = Field(..., min_length=1)
    toLocation: str = Field(..., min_length=1)
    distance: str = ""
    duration: str = ""
    vehicleTypes: List[str] = ["car", "bus"]
    isActive: bool = True


class RouteUpdate(BaseModel):
    fromLocation: Optional[str] = None
    toLocation: Optional[str] = None
    distance: Optional[str] = None
    duration: Optional[str] = None
    vehicleTypes: Optional[List[str]] = None
    isActive: Optional[bool] = None


class RouteResponse(BaseModel):
    id: str = Field(..., alias="_id")
    fromLocation: str
    toLocation: str
    distance: str
    duration: str
    vehicleTypes: List[str]
    isActive: bool
    createdAt: Optional[datetime] = None
    updatedAt: Optional[datetime] = None

    class Config:
        populate_by_name = True
