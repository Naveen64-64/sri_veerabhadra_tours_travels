"""
Routes router — CRUD for travel routes.
"""
from fastapi import APIRouter, HTTPException, Depends, Query
from typing import List, Optional
from datetime import datetime
from bson import ObjectId

from app.database import get_database
from app.schemas.route import RouteCreate, RouteUpdate, RouteResponse
from app.services.auth_service import get_current_admin

router = APIRouter()


def serialize_route(route: dict) -> dict:
    route["_id"] = str(route["_id"])
    return route


@router.get("", response_model=List[RouteResponse])
async def get_routes(
    fromLocation: Optional[str] = Query(None),
    toLocation: Optional[str] = Query(None),
    vehicleType: Optional[str] = Query(None),
):
    """Get routes, optionally filtered by location or vehicle type."""
    db = get_database()
    query = {"isActive": True}
    if fromLocation:
        query["fromLocation"] = {"$regex": fromLocation, "$options": "i"}
    if toLocation:
        query["toLocation"] = {"$regex": toLocation, "$options": "i"}
    if vehicleType:
        query["vehicleTypes"] = vehicleType

    routes = await db.routes.find(query).to_list(100)
    return [serialize_route(r) for r in routes]


@router.post("", response_model=RouteResponse)
async def create_route(route: RouteCreate, admin=Depends(get_current_admin)):
    db = get_database()
    doc = route.model_dump()
    doc["createdAt"] = datetime.utcnow()
    doc["updatedAt"] = datetime.utcnow()
    result = await db.routes.insert_one(doc)
    created = await db.routes.find_one({"_id": result.inserted_id})
    return serialize_route(created)


@router.put("/{route_id}", response_model=RouteResponse)
async def update_route(route_id: str, route: RouteUpdate, admin=Depends(get_current_admin)):
    db = get_database()
    update_data = {k: v for k, v in route.model_dump().items() if v is not None}
    update_data["updatedAt"] = datetime.utcnow()
    try:
        result = await db.routes.update_one(
            {"_id": ObjectId(route_id)}, {"$set": update_data}
        )
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid route ID")
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Route not found")
    updated = await db.routes.find_one({"_id": ObjectId(route_id)})
    return serialize_route(updated)


@router.delete("/{route_id}")
async def delete_route(route_id: str, admin=Depends(get_current_admin)):
    db = get_database()
    try:
        result = await db.routes.delete_one({"_id": ObjectId(route_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid route ID")
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Route not found")
    return {"message": "Route deleted successfully"}
