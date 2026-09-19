"""
Packages router — CRUD for travel packages.
"""
from fastapi import APIRouter, HTTPException, Depends
from typing import List
from datetime import datetime
from bson import ObjectId

from app.database import get_database
from app.schemas.package import PackageCreate, PackageUpdate, PackageResponse
from app.services.auth_service import get_current_admin

router = APIRouter()


def serialize_package(pkg: dict) -> dict:
    pkg["_id"] = str(pkg["_id"])
    return pkg


@router.get("", response_model=List[PackageResponse])
async def get_packages():
    db = get_database()
    packages = await db.packages.find({"isActive": True}).sort("createdAt", -1).to_list(100)
    return [serialize_package(p) for p in packages]


@router.get("/all", response_model=List[PackageResponse])
async def get_all_packages(admin=Depends(get_current_admin)):
    db = get_database()
    packages = await db.packages.find().sort("createdAt", -1).to_list(100)
    return [serialize_package(p) for p in packages]


@router.get("/{package_id}", response_model=PackageResponse)
async def get_package(package_id: str):
    db = get_database()
    try:
        pkg = await db.packages.find_one({"_id": ObjectId(package_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid package ID")
    if not pkg:
        raise HTTPException(status_code=404, detail="Package not found")
    return serialize_package(pkg)


@router.post("", response_model=PackageResponse)
async def create_package(package: PackageCreate, admin=Depends(get_current_admin)):
    db = get_database()
    doc = package.model_dump()
    doc["createdAt"] = datetime.utcnow()
    doc["updatedAt"] = datetime.utcnow()
    result = await db.packages.insert_one(doc)
    created = await db.packages.find_one({"_id": result.inserted_id})
    return serialize_package(created)


@router.put("/{package_id}", response_model=PackageResponse)
async def update_package(package_id: str, package: PackageUpdate, admin=Depends(get_current_admin)):
    db = get_database()
    update_data = {k: v for k, v in package.model_dump().items() if v is not None}
    update_data["updatedAt"] = datetime.utcnow()
    try:
        result = await db.packages.update_one(
            {"_id": ObjectId(package_id)}, {"$set": update_data}
        )
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid package ID")
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Package not found")
    updated = await db.packages.find_one({"_id": ObjectId(package_id)})
    return serialize_package(updated)


@router.delete("/{package_id}")
async def delete_package(package_id: str, admin=Depends(get_current_admin)):
    db = get_database()
    try:
        result = await db.packages.delete_one({"_id": ObjectId(package_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid package ID")
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Package not found")
    return {"message": "Package deleted successfully"}
