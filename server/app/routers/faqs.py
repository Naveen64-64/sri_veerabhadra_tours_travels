"""
FAQs router — CRUD for frequently asked questions.
"""
from fastapi import APIRouter, HTTPException, Depends
from typing import List
from datetime import datetime
from bson import ObjectId

from app.database import get_database
from app.schemas.faq import FAQCreate, FAQUpdate, FAQResponse
from app.services.auth_service import get_current_admin

router = APIRouter()


def serialize_faq(faq: dict) -> dict:
    faq["_id"] = str(faq["_id"])
    return faq


@router.get("", response_model=List[FAQResponse])
async def get_faqs():
    db = get_database()
    faqs = await db.faqs.find({"isActive": True}).sort("order", 1).to_list(100)
    return [serialize_faq(f) for f in faqs]


@router.get("/all", response_model=List[FAQResponse])
async def get_all_faqs(admin=Depends(get_current_admin)):
    db = get_database()
    faqs = await db.faqs.find().sort("order", 1).to_list(100)
    return [serialize_faq(f) for f in faqs]


@router.post("", response_model=FAQResponse)
async def create_faq(faq: FAQCreate, admin=Depends(get_current_admin)):
    db = get_database()
    doc = faq.model_dump()
    doc["createdAt"] = datetime.utcnow()
    doc["updatedAt"] = datetime.utcnow()
    result = await db.faqs.insert_one(doc)
    created = await db.faqs.find_one({"_id": result.inserted_id})
    return serialize_faq(created)


@router.put("/{faq_id}", response_model=FAQResponse)
async def update_faq(faq_id: str, faq: FAQUpdate, admin=Depends(get_current_admin)):
    db = get_database()
    update_data = {k: v for k, v in faq.model_dump().items() if v is not None}
    update_data["updatedAt"] = datetime.utcnow()
    try:
        result = await db.faqs.update_one(
            {"_id": ObjectId(faq_id)}, {"$set": update_data}
        )
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid FAQ ID")
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="FAQ not found")
    updated = await db.faqs.find_one({"_id": ObjectId(faq_id)})
    return serialize_faq(updated)


@router.delete("/{faq_id}")
async def delete_faq(faq_id: str, admin=Depends(get_current_admin)):
    db = get_database()
    try:
        result = await db.faqs.delete_one({"_id": ObjectId(faq_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid FAQ ID")
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="FAQ not found")
    return {"message": "FAQ deleted successfully"}
