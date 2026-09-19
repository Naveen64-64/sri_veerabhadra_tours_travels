"""
FAQ model.
"""

# MongoDB document structure for the 'faqs' collection:
#
# {
#     "_id": ObjectId,
#     "question": str,
#     "answer": str,
#     "category": str,       # "general", "booking", "vehicle", "tour", "payment"
#     "order": int,          # Display order
#     "isActive": bool,
#     "createdAt": datetime,
#     "updatedAt": datetime,
# }
