"""
Booking model — represents a booking/inquiry request.
"""

# MongoDB document structure for the 'bookings' collection:
#
# {
#     "_id": ObjectId,
#     "name": str,
#     "phone": str,
#     "email": str,
#     "travelDate": str,       # ISO date string
#     "fromLocation": str,
#     "toLocation": str,
#     "passengers": int,
#     "vehicleType": str,      # "car" or "bus"
#     "vehicleId": str,        # Optional reference to specific vehicle
#     "message": str,
#     "status": str,           # "pending", "confirmed", "cancelled", "completed"
#     "createdAt": datetime,
#     "updatedAt": datetime,
# }
