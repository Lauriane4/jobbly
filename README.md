# 🎯 Jobbly — Tracker de Candidatures

Application web full-stack de suivi de candidatures avec authentification sécurisée, tableau de bord interactif et export excel.

## Application en production
 **[Accéder à l'application](https://jobbly-candidatures.onrender.com)**

> ⚠️ L'instance gratuite Render peut mettre ~50 secondes à démarrer après une période d'inactivité.


## Stack Technique

- **Backend :** Python (FastAPI), SQLAlchemy, PostgreSQL, JWT, bcrypt, openpyxl
- **Frontend :** HTML5, JavaScript (ES6), CSS3
- **DevOps :** Docker, Docker Compose, GitHub Actions, Render


## Fonctionnalités

- **Authentification sécurisée** — inscription, connexion, tokens JWT, mots de passe hashés avec bcrypt
- **Tableau de bord** — ajout, modification, suppression de candidatures
- **Domaines et spécialités** — sélection hiérarchique parmi 14 secteurs d'activité
- **Statuts colorés** — Postulé, Entretien, Offre, Refusé, Sans réponse
- **Export excel** — fichier stylé aux couleurs Jobbly avec résumé par statut et formatage conditionnel


## Architecture
```
jobbly/
├── backend/
│   ├── main.py              # Point d'entrée FastAPI
│   ├── database.py          # Connexion PostgreSQL via SQLAlchemy
│   ├── models.py            # Modèles ORM (User, Application)
│   ├── security.py          # JWT + bcrypt
│   ├── routers/
│   │   ├── authentification.py  # /auth/register, /auth/login
│   │   ├── applications.py      # CRUD /applications
│   │   └── export.py            # GET /export/excel
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── index.html           # Page login/register
│   ├── dashboard.html       # Tableau de bord
│   ├── authentification.js  # Logique authentification
│   ├── dashboard.js         # Logique dashboard + appels API
│   ├── style.css            # Styles page authentification
│   └── dashboard.style.css  # Styles dashboard
│   
├── docker-compose.yml
└── README.md
```

## Installation et Lancement en local

Assurez-vous d'avoir **Docker** et **Docker Compose** installés.
```bash
# Cloner le projet
git clone https://github.com/Lauriane4/jobbly.git
cd jobbly

# Lancer l'application
docker-compose up --build
```
- **Backend API :** http://localhost:8000
- **Documentation API :** http://localhost:8000/docs
- **Frontend :** Ouvrir simplement le fichier `frontend/index.html` dans votre navigateur (double-clic ou glisser-déposer dans le navigateur).

> ⚠️ Assurez-vous que le backend est bien démarré avant d'utiliser l'application.



## Concepts techniques utilisés

- **JWT (JSON Web Token)** — authentification stateless, token signé envoyé à chaque requête
- **bcrypt** — hashage irréversible des mots de passe
- **ORM SQLAlchemy** — abstraction de la base de données en Python
- **CRUD** — Create, Read, Update, Delete sur les candidatures
- **Formatage conditionnel excel** — couleurs automatiques selon le statut via openpyxl