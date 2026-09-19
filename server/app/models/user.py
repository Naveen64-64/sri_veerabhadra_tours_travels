"""
User model — for admin authentication.
"""

# MongoDB document structure for the 'users' collection:
#
# {
#     "_id": ObjectId,
#     "email": str,
#     "passwordHash": str,
#     "name": str,
#     "role": str,           # "admin"
#     "createdAt": datetime,
# }
