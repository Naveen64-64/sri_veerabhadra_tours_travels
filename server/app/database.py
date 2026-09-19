"""
MongoDB Atlas connection using Motor (async driver).
"""
import dns.resolver
from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings

# Use Google Public DNS to resolve MongoDB Atlas SRV records
# (fixes DNS timeout on restricted/corporate networks)
dns.resolver.default_resolver = dns.resolver.Resolver(configure=False)
dns.resolver.default_resolver.nameservers = ["8.8.8.8", "8.8.4.4"]

client: AsyncIOMotorClient = None
db = None


async def connect_to_mongo():
    """Connect to MongoDB Atlas."""
    global client, db
    client = AsyncIOMotorClient(settings.mongodb_uri)
    db = client[settings.mongodb_db_name]
    print(f"Connected to MongoDB: {settings.mongodb_db_name}")


async def close_mongo_connection():
    """Close MongoDB connection."""
    global client
    if client:
        client.close()
        print("MongoDB connection closed")


def get_database():
    """Get the database instance."""
    return db
