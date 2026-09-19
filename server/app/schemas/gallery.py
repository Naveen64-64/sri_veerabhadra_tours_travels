"""
Gallery Pydantic schemas.
"""
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class GalleryCreate(BaseModel):
    title: str = Field(..., min_length=1)
    image: str = ""
    category: str = "destinations"
    order: int = 0
    isActive: bool = True


class GalleryUpdate(BaseModel):
    title: Optional[str] = None
    image: Optional[str] = None
    category: Optional[str] = None
    order: Optional[int] = None
    isActive: Optional[bool] = None


class GalleryResponse(BaseModel):
    id: str = Field(..., alias="_id")
    title: str
    image: str
    category: str
    order: int
    isActive: bool
    createdAt: Optional[datetime] = None

    class Config:
        populate_by_name = True
