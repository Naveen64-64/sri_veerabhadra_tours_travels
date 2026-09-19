"""
FastAPI main application entry point.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.database import connect_to_mongo, close_mongo_connection
from app.routers import (
    auth, vehicles, bookings, tours, packages,
    destinations, faqs, gallery, routes, rag
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events."""
    await connect_to_mongo()
    yield
    await close_mongo_connection()


app = FastAPI(
    title="Sri Veerabhadra Tours and Travels API",
    description="Backend API for Sri Veerabhadra Tours and Travels website",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS - allow frontend dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(vehicles.router, prefix="/api/vehicles", tags=["Vehicles"])
app.include_router(bookings.router, prefix="/api/bookings", tags=["Bookings"])
app.include_router(tours.router, prefix="/api/tours", tags=["Tours"])
app.include_router(packages.router, prefix="/api/packages", tags=["Packages"])
app.include_router(destinations.router, prefix="/api/destinations", tags=["Destinations"])
app.include_router(faqs.router, prefix="/api/faqs", tags=["FAQs"])
app.include_router(gallery.router, prefix="/api/gallery", tags=["Gallery"])
app.include_router(routes.router, prefix="/api/routes", tags=["Routes"])
app.include_router(rag.router, prefix="/api/rag", tags=["RAG"])


@app.get("/api/health")
async def health_check():
    return {"status": "ok", "message": "Sri Veerabhadra Tours and Travels API is running"}
