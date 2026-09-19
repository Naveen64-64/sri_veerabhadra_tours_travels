"""
RAG ingestion — stores documents with embeddings into MongoDB.
"""
from datetime import datetime
from typing import Dict, Any, Optional
import logging

from app.database import get_database
from app.rag.embeddings import generate_embedding

logger = logging.getLogger(__name__)


async def ingest_document(
    title: str,
    content: str,
    category: str = "general",
    source: str = "",
    metadata: Optional[Dict[str, Any]] = None,
) -> str:
    """
    Ingest a single document into the RAG knowledge base.
    Generates embedding and stores in rag_documents collection.
    Returns the document ID.
    """
    db = get_database()

    # Generate embedding from content
    embedding = generate_embedding(f"{title}. {content}")

    doc = {
        "title": title,
        "content": content,
        "category": category,
        "source": source,
        "metadata": metadata or {},
        "embedding": embedding,
        "createdAt": datetime.utcnow(),
        "updatedAt": datetime.utcnow(),
    }

    result = await db.rag_documents.insert_one(doc)
    logger.info(f"Ingested RAG document: {title} (ID: {result.inserted_id})")
    return str(result.inserted_id)


async def reindex_document(document_id: str) -> bool:
    """
    Re-generate embedding for an existing document.
    Useful when the content has been updated.
    """
    from bson import ObjectId

    db = get_database()
    try:
        doc = await db.rag_documents.find_one({"_id": ObjectId(document_id)})
    except Exception:
        return False

    if not doc:
        return False

    # Re-generate embedding
    embedding = generate_embedding(f"{doc['title']}. {doc['content']}")

    await db.rag_documents.update_one(
        {"_id": ObjectId(document_id)},
        {
            "$set": {
                "embedding": embedding,
                "updatedAt": datetime.utcnow(),
            }
        },
    )
    logger.info(f"Re-indexed document: {doc['title']}")
    return True


async def ingest_vehicle_data():
    """
    Auto-ingest vehicle data from the vehicles collection into RAG.
    This creates RAG documents from existing vehicle records.
    """
    db = get_database()
    vehicles = await db.vehicles.find().to_list(100)

    count = 0
    for v in vehicles:
        content = (
            f"Vehicle: {v['name']}. "
            f"Type: {v['type']}. "
            f"Seats: {v['seats']}. "
            f"AC: {'Yes' if v.get('ac') else 'No'}. "
            f"Driver Available: {'Yes' if v.get('driverAvailable') else 'No'}. "
            f"Fuel: {v.get('fuelType', 'N/A')}. "
            f"Description: {v.get('description', '')}. "
            f"Features: {', '.join(v.get('features', []))}."
        )
        if v.get('pricePerDay', 0) > 0:
            content += f" Price per day: ₹{v['pricePerDay']}."
        if v.get('pricePerKm', 0) > 0:
            content += f" Price per km: ₹{v['pricePerKm']}."

        await ingest_document(
            title=f"Vehicle - {v['name']}",
            content=content,
            category="vehicle",
            source="vehicles_collection",
            metadata={"vehicleId": str(v["_id"]), "type": v["type"]},
        )
        count += 1

    logger.info(f"Ingested {count} vehicles into RAG")
    return count


async def ingest_faq_data():
    """Auto-ingest FAQ data into RAG."""
    db = get_database()
    faqs = await db.faqs.find({"isActive": True}).to_list(100)

    count = 0
    for f in faqs:
        await ingest_document(
            title=f"FAQ - {f['question']}",
            content=f"Question: {f['question']} Answer: {f['answer']}",
            category="faq",
            source="faqs_collection",
        )
        count += 1

    logger.info(f"Ingested {count} FAQs into RAG")
    return count
