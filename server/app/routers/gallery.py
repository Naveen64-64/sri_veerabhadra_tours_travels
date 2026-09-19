"""
Gallery router — CRUD for gallery images.
"""
from fastapi import APIRouter, HTTPException, Depends, Query
from typing import List, Optional
from datetime import datetime
from bson import ObjectId

from app.database import get_database
from app.schemas.gallery import GalleryCreate, GalleryUpdate, GalleryResponse
from app.services.auth_service import get_current_admin

router = APIRouter()


def serialize_gallery(item: dict) -> dict:
    item["_id"] = str(item["_id"])
    return item


@router.get("", response_model=List[GalleryResponse])
async def get_gallery(
    category: Optional[str] = Query(None),
):
    db = get_database()
    query = {"isActive": True}
    if category:
        query["category"] = category
    items = await db.gallery.find(query).sort("order", 1).to_list(100)
    return [serialize_gallery(i) for i in items]


@router.post("", response_model=GalleryResponse)
async def create_gallery_item(item: GalleryCreate, admin=Depends(get_current_admin)):
    db = get_database()
    doc = item.model_dump()
    doc["createdAt"] = datetime.utcnow()
    result = await db.gallery.insert_one(doc)
    created = await db.gallery.find_one({"_id": result.inserted_id})
    return serialize_gallery(created)


@router.put("/{item_id}", response_model=GalleryResponse)
async def update_gallery_item(item_id: str, item: GalleryUpdate, admin=Depends(get_current_admin)):
    db = get_database()
    update_data = {k: v for k, v in item.model_dump().items() if v is not None}
    try:
        result = await db.gallery.update_one(
            {"_id": ObjectId(item_id)}, {"$set": update_data}
        )
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid gallery item ID")
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Gallery item not found")
    updated = await db.gallery.find_one({"_id": ObjectId(item_id)})
    return serialize_gallery(updated)


@router.delete("/{item_id}")
async def delete_gallery_item(item_id: str, admin=Depends(get_current_admin)):
    db = get_database()
    try:
        result = await db.gallery.delete_one({"_id": ObjectId(item_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid gallery item ID")
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Gallery item not found")
    return {"message": "Gallery item deleted successfully"}
