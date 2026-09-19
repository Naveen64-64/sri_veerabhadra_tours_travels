"""
Tour model — represents a bus tour.
"""

# MongoDB document structure for the 'tours' collection:
#
# {
#     "_id": ObjectId,
#     "name": str,
#     "startLocation": str,
#     "destination": str,
#     "duration": str,         # e.g., "2 Days / 1 Night"
#     "places": [str],         # Places covered
#     "busInfo": str,          # Bus details
#     "price": float,          # 0 if not set
#     "description": str,
#     "image": str,
#     "isDemo": bool,
#     "isActive": bool,
#     "createdAt": datetime,
#     "updatedAt": datetime,
# }
