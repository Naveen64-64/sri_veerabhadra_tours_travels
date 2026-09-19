"""
Package Pydantic schemas.
"""
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class PackageCreate(BaseModel):
    name: str = Field(..., min_length=1)
    duration: str = ""
    places: List[str] = []
    vehicleType: str = "both"
    startingPrice: float = Field(default=0, ge=0)
    description: str = ""
    inclusions: List[str] = []
    image: str = ""
    isDemo: bool = False
    isActive: bool = True


class PackageUpdate(BaseModel):
    name: Optional[str] = None
    duration: Optional[str] = None
    places: Optional[List[str]] = None
    vehicleType: Optional[str] = None
    startingPrice: Optional[float] = None
    description: Optional[str] = None
    inclusions: Optional[List[str]] = None
    image: Optional[str] = None
    isDemo: Optional[bool] = None
    isActive: Optional[bool] = None


class PackageResponse(BaseModel):
    id: str = Field(..., alias="_id")
    name: str
    duration: str
    places: List[str]
    vehicleType: str
    startingPrice: float
    description: str
    inclusions: List[str]
    image: str
    isDemo: bool
    isActive: bool
    createdAt: Optional[datetime] = None
    updatedAt: Optional[datetime] = None

    class Config:
        populate_by_name = True
