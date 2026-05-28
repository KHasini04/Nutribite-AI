from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..core.database import get_db
from ..models.nutrition import Nutrition
from ..schemas.nutrition_schema import NutritionCreate, NutritionResponse
from ..services.nutrition_service import get_nutrition_for_meal

router = APIRouter(prefix="/nutrition", tags=["Nutrition"])

@router.get("/{meal_name}", response_model=NutritionResponse)
async def get_nutrition(meal_name: str, db: Session = Depends(get_db)):
    # First check if we have it cached in DB
    existing_nutrition = db.query(Nutrition).filter(Nutrition.meal_name.ilike(f"%{meal_name}%")).first()
    if existing_nutrition:
        return existing_nutrition
    
    # If not in DB, fetch from external API
    nutrition_data = await get_nutrition_for_meal(meal_name)
    if not nutrition_data:
        raise HTTPException(status_code=404, detail="Nutrition data not found")
        
    new_nutrition = Nutrition(
        meal_name=meal_name,
        calories=nutrition_data.get("calories", 0),
        protein=nutrition_data.get("protein", 0),
        carbs=nutrition_data.get("carbs", 0),
        fat=nutrition_data.get("fat", 0),
        health_score=nutrition_data.get("health_score", 5.0)
    )
    db.add(new_nutrition)
    db.commit()
    db.refresh(new_nutrition)
    return new_nutrition
