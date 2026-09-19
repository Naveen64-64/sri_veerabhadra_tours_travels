"""
Gallery model.
"""

# MongoDB document structure for the 'gallery' collection:
#
# {
#     "_id": ObjectId,
#     "title": str,
#     "image": str,           # URL or path
#     "category": str,        # "buses", "cars", "temples", "destinations", "tours"
#     "order": int,
#     "isActive": bool,
#     "createdAt": datetime,
# }
