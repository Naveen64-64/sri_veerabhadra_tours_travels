"""
Route model — represents a travel route.
"""

# MongoDB document structure for the 'routes' collection:
#
# {
#     "_id": ObjectId,
#     "fromLocation": str,
#     "toLocation": str,
#     "distance": str,        # e.g., "350 km"
#     "duration": str,        # e.g., "6 hours"
#     "vehicleTypes": [str],  # ["car", "bus"]
#     "isActive": bool,
#     "createdAt": datetime,
#     "updatedAt": datetime,
# }
