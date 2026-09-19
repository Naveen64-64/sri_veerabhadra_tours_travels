"""
RAG retriever — finds relevant documents using MongoDB Atlas Vector Search.
"""
from typing import List, Dict, Any
import logging

from app.database import get_database
from app.rag.embeddings import generate_embedding

logger = logging.getLogger(__name__)


async def vector_search(query: str, top_k: int = 5) -> List[Dict[str, Any]]:
    """
    Search rag_documents collection using MongoDB Atlas Vector Search.
    Requires a vector search index named 'vector_index' on the rag_documents collection.
    """
    db = get_database()
    query_embedding = generate_embedding(query)

    # MongoDB Atlas Vector Search aggregation pipeline
    pipeline = [
        {
            "$vectorSearch": {
                "index": "vector_index",
                "path": "embedding",
                "queryVector": query_embedding,
                "numCandidates": top_k * 10,
                "limit": top_k,
            }
        },
        {
            "$project": {
                "_id": 1,
                "title": 1,
                "content": 1,
                "category": 1,
                "source": 1,
                "score": {"$meta": "vectorSearchScore"},
            }
        },
    ]

    try:
        results = []
        async for doc in db.rag_documents.aggregate(pipeline):
            doc["_id"] = str(doc["_id"])
            results.append(doc)
        return results
    except Exception as e:
        logger.error(f"Vector search failed: {e}")
        # Fallback: text search if vector search index is not configured
        return await text_search_fallback(query, top_k)


async def text_search_fallback(query: str, top_k: int = 5) -> List[Dict[str, Any]]:
    """
    Fallback text search when vector search index is not available.
    Uses regex matching on content and title fields.
    """
    db = get_database()
    words = query.lower().split()

    # Build an OR query matching any word in title or content
    or_conditions = []
    for word in words[:5]:  # Limit to first 5 words
        or_conditions.append({"title": {"$regex": word, "$options": "i"}})
        or_conditions.append({"content": {"$regex": word, "$options": "i"}})

    if not or_conditions:
        return []

    results = []
    cursor = db.rag_documents.find(
        {"$or": or_conditions},
        {"_id": 1, "title": 1, "content": 1, "category": 1, "source": 1},
    ).limit(top_k)

    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        doc["score"] = 0.5  # Default score for text search
        results.append(doc)

    return results
