"""
Auth router — admin login.
"""
from fastapi import APIRouter, HTTPException, status
from app.database import get_database
from app.schemas.auth import LoginRequest, LoginResponse
from app.services.auth_service import verify_password, create_access_token

router = APIRouter()


@router.post("/login", response_model=LoginResponse)
async def login(request: LoginRequest):
    """Admin login endpoint."""
    db = get_database()
    user = await db.users.find_one({"email": request.email})

    if not user or not verify_password(request.password, user["passwordHash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    token = create_access_token(data={"sub": user["email"]})

    return LoginResponse(
        token=token,
        email=user["email"],
        name=user.get("name", "Admin"),
        role=user.get("role", "admin"),
    )
