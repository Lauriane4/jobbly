from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine
import models
from routers import authentification, application

# Créer les tables dans la base de données
models.Base.metadata.create_all(bind=engine)



app = FastAPI(
    title="Jobbly API",
    description="API de gestion des candidatures",
    version="1.0.0"
)

# Inclure les routes
app.include_router(authentification.router)
app.include_router(application.router)


# CORS — permet au frontend de parler au backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Routes
app.include_router(authentification.router)

@app.get("/")
def root():
    return {"message": "Bienvenue sur l'API Jobbly 🎯"}

@app.get("/health")
def health():
    return {"status": "ok"}