# auth/router.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.auth.service import AuthService
from app.auth.schema import SignUpRequest, SignUpResponse, SignInRequest, SignInResponse, SignOutResponse
from app.infrastructure.database.session import get_db

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=SignUpResponse)
def register(data: SignUpRequest, db: Session = Depends(get_db)):
    try:
        return AuthService(db).register(data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/login", response_model=SignInResponse)
def login(data: SignInRequest, db: Session = Depends(get_db)):
    try:
        return AuthService(db).login(data)
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))

@router.post("/logout", response_model=SignOutResponse)
def logout():
    return SignOutResponse(message="Logged out successfully")