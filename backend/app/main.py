from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.database import engine, Base
from .models import user, order, nutrition, recommendation
from .routes import auth_routes, budget_routes, order_routes, nutrition_routes, recommendation_routes, profile_routes

# We will create tables directly for now, later we can use Alembic migrations
Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Hostel Food & Nutrition Assistant")

# Configure CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_routes.router)
app.include_router(budget_routes.router)
app.include_router(order_routes.router)
app.include_router(nutrition_routes.router)
app.include_router(recommendation_routes.router)
app.include_router(profile_routes.router)

@app.get("/")
def root():
    return {"message": "Welcome to the AI Hostel Food & Nutrition Assistant API"}
