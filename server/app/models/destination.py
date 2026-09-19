"""
Destination model — represents a travel destination.
"""

# MongoDB document structure for the 'destinations' collection:
#
# {
#     "_id": ObjectId,
#     "name": str,
#     "description": str,
#     "tourInfo": str,
#     "category": str,         # "temple", "beach", "hill_station", "city", "pilgrimage"
#     "image": str,
#     "isActive": bool,
#     "createdAt": datetime,
#     "updatedAt": datetime,
# }
