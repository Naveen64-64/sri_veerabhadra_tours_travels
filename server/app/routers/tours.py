"""
Tours router — CRUD for bus tours.
"""
from fastapi import APIRouter, HTTPException, Depends
from typing import List
from datetime import datetime
from bson import ObjectId

from app.database import get_database
from app.schemas.tour import TourCreate, TourUpdate, TourResponse
from app.services.auth_service import get_current_admin

router = APIRouter()


def serialize_tour(tour: dict) -> dict:
    tour["_id"] = str(tour["_id"])
    return tour


@router.get("", response_model=List[TourResponse])
async def get_tours():
    """Get all active tours (public)."""
    db = get_database()
    tours = await db.tours.find({"isActive": True}).sort("createdAt", -1).to_list(100)
    return [serialize_tour(t) for t in tours]


@router.get("/all", response_model=List[TourResponse])
async def get_all_tours(admin=Depends(get_current_admin)):
    """Get all tours including inactive (admin only)."""
    db = get_database()
    tours = await db.tours.find().sort("createdAt", -1).to_list(100)
    return [serialize_tour(t) for t in tours]


@router.get("/{tour_id}", response_model=TourResponse)
async def get_tour(tour_id: str):
    db = get_database()
    try:
        tour = await db.tours.find_one({"_id": ObjectId(tour_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid tour ID")
    if not tour:
        raise HTTPException(status_code=404, detail="Tour not found")
    return serialize_tour(tour)


@router.post("", response_model=TourResponse)
async def create_tour(tour: TourCreate, admin=Depends(get_current_admin)):
    db = get_database()
    doc = tour.model_dump()
    doc["createdAt"] = datetime.utcnow()
    doc["updatedAt"] = datetime.utcnow()
    result = await db.tours.insert_one(doc)
    created = await db.tours.find_one({"_id": result.inserted_id})
    return serialize_tour(created)


@router.put("/{tour_id}", response_model=TourResponse)
async def update_tour(tour_id: str, tour: TourUpdate, admin=Depends(get_current_admin)):
    db = get_database()
    update_data = {k: v for k, v in tour.model_dump().items() if v is not None}
    update_data["updatedAt"] = datetime.utcnow()
    try:
        result = await db.tours.update_one(
            {"_id": ObjectId(tour_id)}, {"$set": update_data}
        )
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid tour ID")
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Tour not found")
    updated = await db.tours.find_one({"_id": ObjectId(tour_id)})
    return serialize_tour(updated)


@router.delete("/{tour_id}")
async def delete_tour(tour_id: str, admin=Depends(get_current_admin)):
    db = get_database()
    try:
        result = await db.tours.delete_one({"_id": ObjectId(tour_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid tour ID")
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Tour not found")
    return {"message": "Tour deleted successfully"}
