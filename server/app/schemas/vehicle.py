"""
Vehicle Pydantic schemas for request/response validation.
"""
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class VehicleCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    type: str = Field(..., pattern="^(car|bus)$")
    seats: int = Field(..., ge=1, le=100)
    ac: bool = True
    fuelType: str = Field(default="diesel")
    driverAvailable: bool = True
    pricePerDay: float = Field(default=0, ge=0)
    pricePerKm: float = Field(default=0, ge=0)
    description: str = ""
    features: List[str] = []
    images: List[str] = []
    availability: bool = True
    isDemo: bool = False


class VehicleUpdate(BaseModel):
    name: Optional[str] = None
    type: Optional[str] = None
    seats: Optional[int] = None
    ac: Optional[bool] = None
    fuelType: Optional[str] = None
    driverAvailable: Optional[bool] = None
    pricePerDay: Optional[float] = None
    pricePerKm: Optional[float] = None
    description: Optional[str] = None
    features: Optional[List[str]] = None
    images: Optional[List[str]] = None
    availability: Optional[bool] = None
    isDemo: Optional[bool] = None


class VehicleResponse(BaseModel):
    id: str = Field(..., alias="_id")
    name: str
    type: str
    seats: int
    ac: bool
    fuelType: str
    driverAvailable: bool
    pricePerDay: float
    pricePerKm: float
    description: str
    features: List[str]
    images: List[str]
    availability: bool
    isDemo: bool
    createdAt: Optional[datetime] = None
    updatedAt: Optional[datetime] = None

    class Config:
        populate_by_name = True
