from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from database import get_db
import models
import security

router = APIRouter(prefix="/auth", tags=["Auth"])


# Schémas Pydantic
class UserRegister(BaseModel):
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str


# Register
@router.post("/register", status_code=201)
def register(user_data: UserRegister, db: Session = Depends(get_db)):
    # Vérifier si l'email existe déjà
    existing_user = db.query(models.User).filter(
        models.User.email == user_data.email
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Cet email est déjà utilisé"
        )

    # Créer l'utilisateur
    hashed = security.hash_password(user_data.password)
    new_user = models.User(
        email=user_data.email,
        hashed_password=hashed
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "Compte créé avec succès !"}


# Login
@router.post("/login")
def login(user_data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(
        models.User.email == user_data.email
    ).first()
    if not user or not security.verify_password(user_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Email ou mot de passe incorrect")

    token = security.create_access_token({"sub": user.email})
    return {"access_token": token, "token_type": "bearer"}