"""
Destinations router — CRUD for destinations.
"""
from fastapi import APIRouter, HTTPException, Depends
from typing import List
from datetime import datetime
from bson import ObjectId

from app.database import get_database
from app.schemas.destination import DestinationCreate, DestinationUpdate, DestinationResponse
from app.services.auth_service import get_current_admin

router = APIRouter()


def serialize_destination(dest: dict) -> dict:
    dest["_id"] = str(dest["_id"])
    return dest


@router.get("", response_model=List[DestinationResponse])
async def get_destinations():
    db = get_database()
    destinations = await db.destinations.find({"isActive": True}).sort("name", 1).to_list(100)
    return [serialize_destination(d) for d in destinations]


@router.get("/all", response_model=List[DestinationResponse])
async def get_all_destinations(admin=Depends(get_current_admin)):
    db = get_database()
    destinations = await db.destinations.find().sort("name", 1).to_list(100)
    return [serialize_destination(d) for d in destinations]


@router.get("/{destination_id}", response_model=DestinationResponse)
async def get_destination(destination_id: str):
    db = get_database()
    try:
        dest = await db.destinations.find_one({"_id": ObjectId(destination_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid destination ID")
    if not dest:
        raise HTTPException(status_code=404, detail="Destination not found")
    return serialize_destination(dest)


@router.post("", response_model=DestinationResponse)
async def create_destination(dest: DestinationCreate, admin=Depends(get_current_admin)):
    db = get_database()
    doc = dest.model_dump()
    doc["createdAt"] = datetime.utcnow()
    doc["updatedAt"] = datetime.utcnow()
    result = await db.destinations.insert_one(doc)
    created = await db.destinations.find_one({"_id": result.inserted_id})
    return serialize_destination(created)


@router.put("/{destination_id}", response_model=DestinationResponse)
async def update_destination(destination_id: str, dest: DestinationUpdate, admin=Depends(get_current_admin)):
    db = get_database()
    update_data = {k: v for k, v in dest.model_dump().items() if v is not None}
    update_data["updatedAt"] = datetime.utcnow()
    try:
        result = await db.destinations.update_one(
            {"_id": ObjectId(destination_id)}, {"$set": update_data}
        )
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid destination ID")
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Destination not found")
    updated = await db.destinations.find_one({"_id": ObjectId(destination_id)})
    return serialize_destination(updated)


@router.delete("/{destination_id}")
async def delete_destination(destination_id: str, admin=Depends(get_current_admin)):
    db = get_database()
    try:
        result = await db.destinations.delete_one({"_id": ObjectId(destination_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid destination ID")
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Destination not found")
    return {"message": "Destination deleted successfully"}
