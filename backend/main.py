from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Jobbly API",
    description="API de gestion des candidatures",
    version="1.0.0"
)

# CORS — permet au frontend de parler au backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Bienvenue sur l'API Jobbly 🎯"}

@app.get("/health")
def health():
    return {"status": "ok"}