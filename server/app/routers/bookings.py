"""
Bookings router — create booking requests and manage them.
"""
from fastapi import APIRouter, HTTPException, Depends, Query
from typing import List, Optional
from datetime import datetime
from bson import ObjectId

from app.database import get_database
from app.schemas.booking import BookingCreate, BookingStatusUpdate, BookingResponse
from app.services.auth_service import get_current_admin

router = APIRouter()


def serialize_booking(booking: dict) -> dict:
    booking["_id"] = str(booking["_id"])
    return booking


@router.post("", response_model=BookingResponse)
async def create_booking(booking: BookingCreate):
    """Create a new booking request (public — no auth required)."""
    db = get_database()
    doc = booking.model_dump()
    doc["status"] = "pending"
    doc["createdAt"] = datetime.utcnow()
    doc["updatedAt"] = datetime.utcnow()

    result = await db.bookings.insert_one(doc)
    created = await db.bookings.find_one({"_id": result.inserted_id})
    return serialize_booking(created)


@router.get("", response_model=List[BookingResponse])
async def get_bookings(
    status: Optional[str] = Query(None),
    admin=Depends(get_current_admin),
):
    """Get all bookings (admin only)."""
    db = get_database()
    query = {}
    if status:
        query["status"] = status

    bookings = await db.bookings.find(query).sort("createdAt", -1).to_list(200)
    return [serialize_booking(b) for b in bookings]


@router.get("/{booking_id}", response_model=BookingResponse)
async def get_booking(booking_id: str, admin=Depends(get_current_admin)):
    """Get a single booking (admin only)."""
    db = get_database()
    try:
        booking = await db.bookings.find_one({"_id": ObjectId(booking_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid booking ID")

    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    return serialize_booking(booking)


@router.put("/{booking_id}/status")
async def update_booking_status(
    booking_id: str,
    status_update: BookingStatusUpdate,
    admin=Depends(get_current_admin),
):
    """Update booking status (admin only)."""
    db = get_database()
    try:
        result = await db.bookings.update_one(
            {"_id": ObjectId(booking_id)},
            {
                "$set": {
                    "status": status_update.status,
                    "updatedAt": datetime.utcnow(),
                }
            },
        )
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid booking ID")

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Booking not found")

    return {"message": f"Booking status updated to {status_update.status}"}
