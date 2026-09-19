"""
Vehicle model — represents a car or bus in the fleet.
"""

# MongoDB document structure for the 'vehicles' collection:
#
# {
#     "_id": ObjectId,
#     "name": str,              # e.g., "Toyota Innova", "Ashok Leyland Bus"
#     "type": str,              # "car" or "bus"
#     "seats": int,             # Number of seats
#     "ac": bool,               # AC or Non-AC
#     "fuelType": str,          # "diesel", "petrol", "electric", "cng"
#     "driverAvailable": bool,  # Whether driver is provided
#     "pricePerDay": float,     # Price (0 if not set yet)
#     "pricePerKm": float,      # Per km rate (0 if not set yet)
#     "description": str,
#     "features": [str],        # List of features
#     "images": [str],          # List of image URLs
#     "availability": bool,     # Currently available
#     "isDemo": bool,           # True if this is demo/placeholder data
#     "createdAt": datetime,
#     "updatedAt": datetime,
# }
