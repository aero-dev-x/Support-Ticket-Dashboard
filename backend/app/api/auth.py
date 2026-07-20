from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app import crud
from app.db import get_db
from app.exceptions import EmailAlreadyRegisteredError, InvalidCredentialsError
from app.models import User
from app.schemas import TokenResponse, UserLogin, UserRead, UserSignup
from app.security import create_access_token, get_current_user, hash_password, verify_password

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/signup", response_model=TokenResponse, status_code=201)
async def signup(data: UserSignup, db: AsyncSession = Depends(get_db)) -> TokenResponse:
    existing = await crud.get_user_by_email(db, data.email)
    if existing is not None:
        raise EmailAlreadyRegisteredError()
    user = await crud.create_user(db, email=data.email, hashed_password=hash_password(data.password))
    token = create_access_token(subject=user.email)
    return TokenResponse(access_token=token)


@router.post("/login", response_model=TokenResponse)
async def login(data: UserLogin, db: AsyncSession = Depends(get_db)) -> TokenResponse:
    user = await crud.get_user_by_email(db, data.email)
    if user is None or not verify_password(data.password, user.hashed_password):
        raise InvalidCredentialsError()
    token = create_access_token(subject=user.email)
    return TokenResponse(access_token=token)


@router.get("/me", response_model=UserRead)
async def me(current_user: User = Depends(get_current_user)) -> User:
    return current_user
