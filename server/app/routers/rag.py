"""
RAG router — query the AI assistant and manage RAG documents.
"""
from fastapi import APIRouter, HTTPException, Depends
from typing import List
from datetime import datetime
from bson import ObjectId
import logging

from app.database import get_database
from app.schemas.rag import (
    RAGDocumentCreate, RAGDocumentUpdate, RAGDocumentResponse,
    RAGQueryRequest, RAGQueryResponse,
)
from app.services.auth_service import get_current_admin
from app.rag.retriever import vector_search
from app.rag.generator import generate_answer, check_ollama_status
from app.rag.ingestion import ingest_document, reindex_document, ingest_vehicle_data, ingest_faq_data
from app.rag.hybrid_search import get_hybrid_context, detect_query_type

logger = logging.getLogger(__name__)
router = APIRouter()


def serialize_doc(doc: dict) -> dict:
    doc["_id"] = str(doc["_id"])
    # Remove embedding from response (too large)
    doc.pop("embedding", None)
    return doc


@router.post("/query", response_model=RAGQueryResponse)
async def query_rag(request: RAGQueryRequest):
    """
    Query the RAG-powered travel assistant.
    Uses hybrid search: structured DB queries + vector search + Ollama LLM.
    """
    query = request.query
    context_parts = []
    sources = []

    # 1. Get hybrid context from structured DB queries
    hybrid_context = await get_hybrid_context(query)
    if hybrid_context:
        context_parts.append(hybrid_context)

    # 2. Get RAG vector search results
    try:
        rag_results = await vector_search(query, top_k=request.top_k)
        for doc in rag_results:
            context_parts.append(f"\n{doc.get('title', '')}: {doc.get('content', '')}")
            sources.append({
                "title": doc.get("title", ""),
                "category": doc.get("category", ""),
                "score": doc.get("score", 0),
            })
    except Exception as e:
        logger.error(f"RAG search error: {e}")

    # 3. Build final context
    if context_parts:
        context = "\n\n".join(context_parts)
    else:
        context = (
            "No specific information found in the database. "
            "Sri Veerabhadra Tours and Travels provides car and bus travel services. "
            "Contact: 9542659999, Email: sriveerabhadratoursandtravels@gmail.com"
        )

    # 4. Generate answer with Ollama
    answer = await generate_answer(context, query)

    return RAGQueryResponse(
        answer=answer,
        sources=sources,
        query=query,
    )


@router.get("/status")
async def get_rag_status():
    """Check RAG system status (Ollama, embedding model, document count)."""
    db = get_database()
    doc_count = await db.rag_documents.count_documents({})
    ollama_status = await check_ollama_status()

    return {
        "rag_documents_count": doc_count,
        "ollama": ollama_status,
    }


@router.get("/documents", response_model=List[RAGDocumentResponse])
async def get_rag_documents(admin=Depends(get_current_admin)):
    """Get all RAG documents (admin only)."""
    db = get_database()
    docs = await db.rag_documents.find(
        {}, {"embedding": 0}  # Exclude embedding from response
    ).sort("createdAt", -1).to_list(200)
    return [serialize_doc(d) for d in docs]


@router.post("/ingest", response_model=RAGDocumentResponse)
async def ingest_rag_document(doc: RAGDocumentCreate, admin=Depends(get_current_admin)):
    """Ingest a new document into RAG knowledge base (admin only)."""
    doc_id = await ingest_document(
        title=doc.title,
        content=doc.content,
        category=doc.category,
        source=doc.source,
        metadata=doc.metadata,
    )

    db = get_database()
    created = await db.rag_documents.find_one(
        {"_id": ObjectId(doc_id)}, {"embedding": 0}
    )
    return serialize_doc(created)


@router.put("/documents/{doc_id}", response_model=RAGDocumentResponse)
async def update_rag_document(doc_id: str, doc: RAGDocumentUpdate, admin=Depends(get_current_admin)):
    """Update a RAG document (admin only). Triggers re-indexing."""
    db = get_database()
    update_data = {k: v for k, v in doc.model_dump().items() if v is not None}
    update_data["updatedAt"] = datetime.utcnow()

    try:
        result = await db.rag_documents.update_one(
            {"_id": ObjectId(doc_id)}, {"$set": update_data}
        )
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid document ID")

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Document not found")

    # Re-index the document with new embedding
    await reindex_document(doc_id)

    updated = await db.rag_documents.find_one(
        {"_id": ObjectId(doc_id)}, {"embedding": 0}
    )
    return serialize_doc(updated)


@router.delete("/documents/{doc_id}")
async def delete_rag_document(doc_id: str, admin=Depends(get_current_admin)):
    """Delete a RAG document (admin only)."""
    db = get_database()
    try:
        result = await db.rag_documents.delete_one({"_id": ObjectId(doc_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid document ID")
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Document not found")
    return {"message": "Document deleted successfully"}


@router.post("/reindex/{doc_id}")
async def reindex_rag_document(doc_id: str, admin=Depends(get_current_admin)):
    """Re-generate embedding for a document (admin only)."""
    success = await reindex_document(doc_id)
    if not success:
        raise HTTPException(status_code=404, detail="Document not found")
    return {"message": "Document re-indexed successfully"}


@router.post("/ingest-all")
async def ingest_all_data(admin=Depends(get_current_admin)):
    """
    Auto-ingest all data from vehicles, FAQs, etc. into RAG (admin only).
    Warning: This will add new documents. Run sparingly.
    """
    vehicle_count = await ingest_vehicle_data()
    faq_count = await ingest_faq_data()

    return {
        "message": "Data ingested successfully",
        "vehicles_ingested": vehicle_count,
        "faqs_ingested": faq_count,
    }
