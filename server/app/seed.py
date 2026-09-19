"""
Seed script — creates initial admin user, demo data, and RAG documents.

Run:
    python -m app.seed
"""

import asyncio
import json
from datetime import datetime, timezone
from pathlib import Path

from app.database import connect_to_mongo, get_database
from app.config import settings
from app.services.auth_service import hash_password


# ============================================================
# JSON FILE LOCATION
# ============================================================

BASE_DIR = Path(__file__).resolve().parent.parent
RAG_JSON_FILE = BASE_DIR / "data" / "sri_veerabhadra_rag_50_documents.json"


# ============================================================
# HELPER
# ============================================================

def now():
    return datetime.now(timezone.utc)


# ============================================================
# SEED
# ============================================================

async def seed():

    await connect_to_mongo()
    db = get_database()

    # ========================================================
    # 1. CREATE ADMIN USER
    # ========================================================

    existing = await db.users.find_one({
        "email": settings.admin_email
    })

    if not existing:

        await db.users.insert_one({
            "email": settings.admin_email,
            "passwordHash": hash_password(
                settings.admin_password
            ),
            "name": "Admin",
            "role": "admin",
            "createdAt": now(),
        })

        print(
            f"Admin user created: {settings.admin_email}"
        )

    else:

        print("Admin user already exists")

    # ========================================================
    # 2. SEED FAQs
    # ========================================================

    faq_count = await db.faqs.count_documents({})

    if faq_count == 0:

        faqs = [

            {
                "question": "How can I book a vehicle?",
                "answer": (
                    "You can book a vehicle by filling out "
                    "the booking form on our website, or by "
                    "calling us at 9542659999. Our team will "
                    "confirm the availability and get back to you."
                ),
                "category": "booking",
                "order": 1,
                "isActive": True,
                "createdAt": now(),
                "updatedAt": now(),
            },

            {
                "question": "Do you provide buses for group travel?",
                "answer": (
                    "Yes, Sri Veerabhadra Tours and Travels "
                    "provides buses for group travel, family "
                    "trips, temple tours, and other group outings. "
                    "Contact us at 9542659999 for details."
                ),
                "category": "vehicle",
                "order": 2,
                "isActive": True,
                "createdAt": now(),
                "updatedAt": now(),
            },

            {
                "question": "Do you provide car travel?",
                "answer": (
                    "Yes, we provide car travel services for "
                    "outstation trips, family travel, and custom "
                    "trips. Contact us at 9542659999 to learn more."
                ),
                "category": "vehicle",
                "order": 3,
                "isActive": True,
                "createdAt": now(),
                "updatedAt": now(),
            },

            {
                "question": "How can I contact the company?",
                "answer": (
                    "You can reach Sri Veerabhadra Tours and Travels "
                    "by calling 9542659999 or by emailing "
                    "sriveerabhadratoursandtravels@gmail.com. "
                    "The owner is P.V. Durga Rao."
                ),
                "category": "general",
                "order": 4,
                "isActive": True,
                "createdAt": now(),
                "updatedAt": now(),
            },

            {
                "question": "What information is required for booking?",
                "answer": (
                    "To book a vehicle, we need your name, phone "
                    "number, travel date, pickup location, drop "
                    "location, number of passengers, and your "
                    "preferred vehicle type (car or bus)."
                ),
                "category": "booking",
                "order": 5,
                "isActive": True,
                "createdAt": now(),
                "updatedAt": now(),
            },

            {
                "question": "Can I request a custom trip?",
                "answer": (
                    "Yes! Sri Veerabhadra Tours and Travels offers "
                    "custom trip planning. Tell us your requirements "
                    "and we will arrange the travel accordingly. "
                    "Contact us at 9542659999."
                ),
                "category": "general",
                "order": 6,
                "isActive": True,
                "createdAt": now(),
                "updatedAt": now(),
            },

        ]

        await db.faqs.insert_many(faqs)

        print(
            f"Seeded {len(faqs)} FAQs"
        )

    else:

        print(
            f"FAQs already exist: {faq_count}"
        )

    # ========================================================
    # 3. SEED TOURS
    # ========================================================

    tour_count = await db.tours.count_documents({})

    if tour_count == 0:

        tours = [

            {
                "name": "Rameshwaram Yatra",
                "startLocation": "Vijayawada",
                "destination": "Rameshwaram",
                "duration": "Multi-day tour",

                "places": [
                    "Kanipakam",
                    "Sripuram",
                    "Arunachalam",
                    "Chidambaram",
                    "Vaideeshwaram",
                    "Kumbakonam",
                    "Swami Malai",
                    "Thanjavur",
                    "Rameshwaram",
                    "Kanyakumari",
                    "Madurai",
                    "Palani",
                    "Jambukeshwaram",
                    "Srirangam",
                    "Samayapuram",
                    "Vishnu Kanchi",
                    "Shiva Kanchi",
                    "Vamana Kanchi",
                    "Tirupati",
                    "Srikalahasti",
                    "Vijayawada",
                ],

                "busInfo": (
                    "AC Bus with meals "
                    "(Breakfast, Lunch, Dinner)"
                ),

                "price": 7499,

                "description": (
                    "Complete Rameshwaram temple tour covering "
                    "20+ famous temples across South India. "
                    "Includes meals - morning tiffin, afternoon "
                    "lunch, and evening tiffin."
                ),

                "image": "",
                "isDemo": False,
                "isActive": True,
                "createdAt": now(),
                "updatedAt": now(),
            },

            {
                "name": "Kashi Yatra",
                "startLocation": "Andhra Pradesh",
                "destination": "Varanasi (Kashi)",
                "duration": "Multi-day tour",

                "places": [
                    "Annavaram",
                    "Simhachalam",
                    "Arasavelli",
                    "Srikurmam",
                    "Konark",
                    "Puri",
                    "Bhubaneswar",
                    "Gaya",
                    "Bodh Gaya",
                    "Allahabad Triveni Sangamam",
                    "Varanasi",
                    "Ayodhya",
                ],

                "busInfo": (
                    "AC Bus with meals "
                    "(Breakfast, Lunch, Dinner). "
                    "Kashi darshans include: Kashi Vishwanath Temple, "
                    "Kashi Visalakshi Temple, Kala Bhairav Temple, "
                    "Varahi Temple, Durga Mata Temple, Ganga Aarti, "
                    "64 Ghats visit."
                ),

                "price": 7999,

                "description": (
                    "Spiritual Kashi Yatra covering important temples "
                    "from Andhra Pradesh to Varanasi. Includes special "
                    "darshans at Kashi Vishwanath and Ganga Aarti. "
                    "Meals included."
                ),

                "image": "",
                "isDemo": False,
                "isActive": True,
                "createdAt": now(),
                "updatedAt": now(),
            },

        ]

        await db.tours.insert_many(tours)

        print(
            f"Seeded {len(tours)} tours"
        )

    else:

        print(
            f"Tours already exist: {tour_count}"
        )

    # ========================================================
    # 4. SEED DESTINATIONS
    # ========================================================

    dest_count = await db.destinations.count_documents({})

    if dest_count == 0:

        destinations = [

            {
                "name": "Rameshwaram",
                "description": (
                    "Famous pilgrimage destination with "
                    "the Ramanathaswamy Temple."
                ),
                "tourInfo": "Covered in Rameshwaram Yatra",
                "category": "temple",
                "image": "",
                "isActive": True,
                "createdAt": now(),
                "updatedAt": now(),
            },

            {
                "name": "Kanyakumari",
                "description": (
                    "Southernmost tip of India with "
                    "the Vivekananda Rock Memorial."
                ),
                "tourInfo": "Covered in Rameshwaram Yatra",
                "category": "pilgrimage",
                "image": "",
                "isActive": True,
                "createdAt": now(),
                "updatedAt": now(),
            },

            {
                "name": "Tirupati",
                "description": (
                    "Home of the famous Sri Venkateswara "
                    "Temple (Tirumala)."
                ),
                "tourInfo": "Covered in Rameshwaram Yatra",
                "category": "temple",
                "image": "",
                "isActive": True,
                "createdAt": now(),
                "updatedAt": now(),
            },

            {
                "name": "Varanasi (Kashi)",
                "description": (
                    "Spiritual capital of India. "
                    "Kashi Vishwanath Temple, Ganga Aarti, "
                    "64 Ghats."
                ),
                "tourInfo": "Covered in Kashi Yatra",
                "category": "pilgrimage",
                "image": "",
                "isActive": True,
                "createdAt": now(),
                "updatedAt": now(),
            },

            {
                "name": "Puri",
                "description": (
                    "Home of the famous Jagannath Temple."
                ),
                "tourInfo": "Covered in Kashi Yatra",
                "category": "temple",
                "image": "",
                "isActive": True,
                "createdAt": now(),
                "updatedAt": now(),
            },

            {
                "name": "Madurai",
                "description": (
                    "City of the Meenakshi Amman Temple."
                ),
                "tourInfo": "Covered in Rameshwaram Yatra",
                "category": "temple",
                "image": "",
                "isActive": True,
                "createdAt": now(),
                "updatedAt": now(),
            },

            {
                "name": "Srikalahasti",
                "description": (
                    "Famous Shiva temple known for Rahu-Ketu pooja."
                ),
                "tourInfo": "Covered in Rameshwaram Yatra",
                "category": "temple",
                "image": "",
                "isActive": True,
                "createdAt": now(),
                "updatedAt": now(),
            },

            {
                "name": "Thanjavur",
                "description": (
                    "Known for the Brihadeeswarar Temple."
                ),
                "tourInfo": "Covered in Rameshwaram Yatra",
                "category": "temple",
                "image": "",
                "isActive": True,
                "createdAt": now(),
                "updatedAt": now(),
            },

            {
                "name": "Kumbakonam",
                "description": (
                    "Town of temples with the famous "
                    "Mahamaham tank."
                ),
                "tourInfo": "Covered in Rameshwaram Yatra",
                "category": "temple",
                "image": "",
                "isActive": True,
                "createdAt": now(),
                "updatedAt": now(),
            },

            {
                "name": "Srirangam",
                "description": (
                    "Island temple town with the "
                    "Sri Ranganathaswamy Temple."
                ),
                "tourInfo": "Covered in Rameshwaram Yatra",
                "category": "temple",
                "image": "",
                "isActive": True,
                "createdAt": now(),
                "updatedAt": now(),
            },

            {
                "name": "Simhachalam",
                "description": (
                    "Famous Varaha Lakshmi Narasimha Temple "
                    "near Visakhapatnam."
                ),
                "tourInfo": "Covered in Kashi Yatra",
                "category": "temple",
                "image": "",
                "isActive": True,
                "createdAt": now(),
                "updatedAt": now(),
            },

            {
                "name": "Konark",
                "description": (
                    "Sun Temple in Odisha."
                ),
                "tourInfo": "Covered in Kashi Yatra",
                "category": "temple",
                "image": "",
                "isActive": True,
                "createdAt": now(),
                "updatedAt": now(),
            },

        ]

        await db.destinations.insert_many(
            destinations
        )

        print(
            f"Seeded {len(destinations)} destinations"
        )

    else:

        print(
            f"Destinations already exist: {dest_count}"
        )

    # ========================================================
    # 5. SEED 50 RAG DOCUMENTS FROM JSON
    # ========================================================

    print()
    print("=" * 60)
    print("Loading RAG documents...")
    print("=" * 60)

    # Check JSON file
    if not RAG_JSON_FILE.exists():

        print(
            f"ERROR: RAG JSON file not found:"
        )

        print(
            f"{RAG_JSON_FILE}"
        )

        print(
            "Please create the data folder and put "
            "sri_veerabhadra_rag_50_documents.json inside it."
        )

        return

    # Read JSON
    try:

        with open(
            RAG_JSON_FILE,
            "r",
            encoding="utf-8"
        ) as file:

            rag_docs = json.load(file)

    except json.JSONDecodeError as e:

        print(
            f"ERROR: Invalid JSON file: {e}"
        )

        return

    # Validate
    if not isinstance(rag_docs, list):

        print(
            "ERROR: JSON file must contain an array of documents."
        )

        return

    print(
        f"Found {len(rag_docs)} RAG documents in JSON."
    )

    # Insert/update documents
    inserted = 0
    updated = 0

    for document in rag_docs:

        title = document.get("title")

        if not title:

            print(
                "Skipping document without title."
            )

            continue

        rag_document = {
            "title": title,

            "content": document.get(
                "content",
                ""
            ),

            "category": document.get(
                "category",
                "general"
            ),

            "source": document.get(
                "source",
                "json_seed"
            ),

            "metadata": document.get(
                "metadata",
                {}
            ),

            # Embedding will be generated later
            # by your RAG ingestion process.
            "embedding": document.get(
                "embedding",
                []
            ),

            "updatedAt": now(),
        }

        result = await db.rag_documents.update_one(

            {
                "title": title
            },

            {
                "$set": rag_document,

                "$setOnInsert": {
                    "createdAt": now()
                }
            },

            upsert=True
        )

        if result.upserted_id:

            inserted += 1

        elif result.modified_count > 0:

            updated += 1

    # ========================================================
    # 6. SHOW RAG RESULT
    # ========================================================

    final_count = await db.rag_documents.count_documents({})

    print()
    print("=" * 60)
    print("RAG SEED COMPLETED")
    print("=" * 60)

    print(
        f"New documents inserted : {inserted}"
    )

    print(
        f"Existing documents updated : {updated}"
    )

    print(
        f"Total RAG documents in MongoDB : {final_count}"
    )

    print()
    print(
        "IMPORTANT:"
    )

    print(
        "Run your RAG embedding/ingestion endpoint "
        "to generate embeddings for these documents."
    )

    print()
    print(
        "Example:"
    )

    print(
        "POST /api/rag/ingest-all"
    )

    print()
    print(
        "After embeddings are generated, "
        "your MongoDB Atlas vector_index can search them."
    )

    print()
    print("Seed completed!")


# ============================================================
# MAIN
# ============================================================

if __name__ == "__main__":

    asyncio.run(seed())