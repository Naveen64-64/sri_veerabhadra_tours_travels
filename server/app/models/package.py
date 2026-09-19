"""
Package model — represents a travel package.
"""

# MongoDB document structure for the 'packages' collection:
#
# {
#     "_id": ObjectId,
#     "name": str,
#     "duration": str,         # e.g., "3 Days / 2 Nights"
#     "places": [str],         # Places covered
#     "vehicleType": str,      # "car", "bus", "both"
#     "startingPrice": float,  # 0 if not set
#     "description": str,
#     "inclusions": [str],
#     "image": str,
#     "isDemo": bool,
#     "isActive": bool,
#     "createdAt": datetime,
#     "updatedAt": datetime,
# }
