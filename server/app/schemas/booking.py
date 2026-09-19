"""
Booking Pydantic schemas.
"""
from pydantic import BaseModel, Field, EmailStr
from typing import Optional
from datetime import datetime


class BookingCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    phone: str = Field(..., min_length=10, max_length=15)
    email: str = Field(default="")
    travelDate: str = Field(...)
    fromLocation: str = Field(..., min_length=1)
    toLocation: str = Field(..., min_length=1)
    passengers: int = Field(..., ge=1, le=100)
    vehicleType: str = Field(default="car")
    vehicleId: Optional[str] = None
    message: str = ""


class BookingStatusUpdate(BaseModel):
    status: str = Field(..., pattern="^(pending|confirmed|cancelled|completed)$")


class BookingResponse(BaseModel):
    id: str = Field(..., alias="_id")
    name: str
    phone: str
    email: str
    travelDate: str
    fromLocation: str
    toLocation: str
    passengers: int
    vehicleType: str
    vehicleId: Optional[str] = None
    message: str
    status: str
    createdAt: Optional[datetime] = None
    updatedAt: Optional[datetime] = None

    class Config:
        populate_by_name = True
