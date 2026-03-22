from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from database import get_db
from security import get_current_user
import models

router = APIRouter(prefix="/applications", tags=["Applications"])


# Schéma Pydantic
class ApplicationCreate(BaseModel):
    company: str
    job_title: str
    domain: Optional[str] = None
    specialty: Optional[str] = None
    status: Optional[str] = "Postulé"
    city: Optional[str] = None
    country: Optional[str] = None
    salary: Optional[str] = None
    date_applied: Optional[str] = None
    link: Optional[str] = None
    notes: Optional[str] = None


# GET — liste toutes les candidatures de l'utilisateur connecté
@router.get("/")
def get_applications(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    return db.query(models.Application).filter(
        models.Application.user_id == current_user.id
    ).all()


# POST — créer une candidature
@router.post("/", status_code=201)
def create_application(
    app_data: ApplicationCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    new_app = models.Application(
        **app_data.model_dump(),
        user_id=current_user.id
    )
    db.add(new_app)
    db.commit()
    db.refresh(new_app)
    return new_app


# PUT — modifier une candidature
@router.put("/{app_id}")
def update_application(
    app_id: int,
    app_data: ApplicationCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    app = db.query(models.Application).filter(
        models.Application.id == app_id,
        models.Application.user_id == current_user.id
    ).first()

    if not app:
        raise HTTPException(status_code=404, detail="Candidature introuvable")

    for key, value in app_data.model_dump().items():
        setattr(app, key, value)

    db.commit()
    db.refresh(app)
    return app


# DELETE — supprimer une candidature
@router.delete("/{app_id}")
def delete_application(
    app_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    app = db.query(models.Application).filter(
        models.Application.id == app_id,
        models.Application.user_id == current_user.id
    ).first()

    if not app:
        raise HTTPException(status_code=404, detail="Candidature introuvable")

    db.delete(app)
    db.commit()
    return {"message": "Candidature supprimée"}