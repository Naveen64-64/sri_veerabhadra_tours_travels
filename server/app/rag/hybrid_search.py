"""
Hybrid search — combines MongoDB structured queries with RAG vector search.
Handles queries that need database lookups (e.g., "buses with 30 seats")
alongside knowledge-based queries (e.g., "how to book").
"""
from typing import Dict, Any, List
import logging
import re

from app.database import get_database

logger = logging.getLogger(__name__)

# Keywords that indicate a structured database query
VEHICLE_KEYWORDS = ["bus", "buses", "car", "cars", "vehicle", "vehicles", "seat", "seats", "ac", "non-ac"]
BOOKING_KEYWORDS = ["book", "booking", "reserve", "reservation"]
TOUR_KEYWORDS = ["tour", "tours", "trip", "trips"]
PACKAGE_KEYWORDS = ["package", "packages"]
ROUTE_KEYWORDS = ["route", "routes", "from", "to", "distance"]


def detect_query_type(query: str) -> str:
    """Detect whether a query needs structured DB search, RAG, or both."""
    query_lower = query.lower()

    # Check for specific number patterns (e.g., "30 seats", "20 people")
    has_number = bool(re.search(r'\d+', query_lower))
    has_vehicle = any(kw in query_lower for kw in VEHICLE_KEYWORDS)

    if has_number and has_vehicle:
        return "structured"  # Direct DB query for specific vehicle specs

    if any(kw in query_lower for kw in BOOKING_KEYWORDS):
        return "hybrid"  # Both DB data and RAG knowledge

    return "rag"  # Default to RAG for general questions


async def structured_vehicle_search(query: str) -> List[Dict[str, Any]]:
    """Search vehicles collection based on query parameters."""
    db = get_database()
    query_lower = query.lower()
    mongo_query = {}

    # Detect vehicle type
    if "bus" in query_lower:
        mongo_query["type"] = "bus"
    elif "car" in query_lower:
        mongo_query["type"] = "car"

    # Detect seat count
    seat_match = re.search(r'(\d+)\s*(?:seat|seats|people|person|passengers)', query_lower)
    if seat_match:
        seat_count = int(seat_match.group(1))
        mongo_query["seats"] = {"$gte": seat_count}

    # Detect AC preference
    if "non-ac" in query_lower or "non ac" in query_lower:
        mongo_query["ac"] = False
    elif "ac" in query_lower:
        mongo_query["ac"] = True

    # Only available vehicles
    mongo_query["availability"] = True

    vehicles = await db.vehicles.find(mongo_query).to_list(20)

    results = []
    for v in vehicles:
        results.append({
            "type": "vehicle",
            "name": v["name"],
            "vehicleType": v["type"],
            "seats": v["seats"],
            "ac": v.get("ac", False),
            "price": v.get("pricePerDay", 0),
            "description": v.get("description", ""),
        })

    return results


async def get_hybrid_context(query: str) -> str:
    """
    Build context from both structured DB queries and RAG search.
    Returns a formatted context string for the LLM.
    """
    query_type = detect_query_type(query)
    context_parts = []

    if query_type in ("structured", "hybrid"):
        # Get structured results from DB
        vehicles = await structured_vehicle_search(query)
        if vehicles:
            context_parts.append("Available Vehicles from Database:")
            for v in vehicles:
                price_info = f"₹{v['price']}/day" if v['price'] > 0 else "Contact for price"
                context_parts.append(
                    f"- {v['name']} ({v['vehicleType']}, {v['seats']} seats, "
                    f"{'AC' if v['ac'] else 'Non-AC'}, {price_info})"
                )

    return "\n".join(context_parts)
