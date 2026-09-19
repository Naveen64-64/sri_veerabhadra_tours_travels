"""
Vehicles router — CRUD operations for cars and buses.
"""
from fastapi import APIRouter, HTTPException, Depends, Query
from typing import List, Optional
from datetime import datetime
from bson import ObjectId

from app.database import get_database
from app.schemas.vehicle import VehicleCreate, VehicleUpdate, VehicleResponse
from app.services.auth_service import get_current_admin

router = APIRouter()


def serialize_vehicle(vehicle: dict) -> dict:
    """Convert MongoDB document to response format."""
    vehicle["_id"] = str(vehicle["_id"])
    return vehicle


@router.get("", response_model=List[VehicleResponse])
async def get_vehicles(
    type: Optional[str] = Query(None, description="Filter by type: car or bus"),
    available: Optional[bool] = Query(None, description="Filter by availability"),
):
    """Get all vehicles, optionally filtered."""
    db = get_database()
    query = {}
    if type:
        query["type"] = type
    if available is not None:
        query["availability"] = available

    vehicles = await db.vehicles.find(query).sort("createdAt", -1).to_list(100)
    return [serialize_vehicle(v) for v in vehicles]


@router.get("/{vehicle_id}", response_model=VehicleResponse)
async def get_vehicle(vehicle_id: str):
    """Get a single vehicle by ID."""
    db = get_database()
    try:
        vehicle = await db.vehicles.find_one({"_id": ObjectId(vehicle_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid vehicle ID")

    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    return serialize_vehicle(vehicle)


@router.post("", response_model=VehicleResponse)
async def create_vehicle(
    vehicle: VehicleCreate, admin=Depends(get_current_admin)
):
    """Create a new vehicle (admin only)."""
    db = get_database()
    doc = vehicle.model_dump()
    doc["createdAt"] = datetime.utcnow()
    doc["updatedAt"] = datetime.utcnow()

    result = await db.vehicles.insert_one(doc)
    created = await db.vehicles.find_one({"_id": result.inserted_id})
    return serialize_vehicle(created)


@router.put("/{vehicle_id}", response_model=VehicleResponse)
async def update_vehicle(
    vehicle_id: str, vehicle: VehicleUpdate, admin=Depends(get_current_admin)
):
    """Update a vehicle (admin only)."""
    db = get_database()
    update_data = {k: v for k, v in vehicle.model_dump().items() if v is not None}
    update_data["updatedAt"] = datetime.utcnow()

    try:
        result = await db.vehicles.update_one(
            {"_id": ObjectId(vehicle_id)}, {"$set": update_data}
        )
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid vehicle ID")

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Vehicle not found")

    updated = await db.vehicles.find_one({"_id": ObjectId(vehicle_id)})
    return serialize_vehicle(updated)


@router.delete("/{vehicle_id}")
async def delete_vehicle(vehicle_id: str, admin=Depends(get_current_admin)):
    """Delete a vehicle (admin only)."""
    db = get_database()
    try:
        result = await db.vehicles.delete_one({"_id": ObjectId(vehicle_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid vehicle ID")

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Vehicle not found")

    return {"message": "Vehicle deleted successfully"}
