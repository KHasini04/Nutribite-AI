from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..core.database import get_db
from ..models.user import User
from ..auth.dependencies import get_current_user
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/profile", tags=["Profile"])

class ProfileUpdate(BaseModel):
    monthly_budget: Optional[float]
    goal: Optional[str]
    food_preference: Optional[str]
    target_calories: Optional[int]
    target_protein: Optional[int]

@router.put("/")
def update_profile(profile_data: ProfileUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if profile_data.monthly_budget is not None:
        current_user.monthly_budget = profile_data.monthly_budget
    if profile_data.goal is not None:
        current_user.goal = profile_data.goal
    if profile_data.food_preference is not None:
        current_user.food_preference = profile_data.food_preference
    if profile_data.target_calories is not None:
        current_user.target_calories = profile_data.target_calories
    if profile_data.target_protein is not None:
        current_user.target_protein = profile_data.target_protein
        
    db.commit()
    db.refresh(current_user)
    
    return {
        "message": "Profile updated successfully", 
        "user": {
            "id": current_user.id,
            "name": current_user.name,
            "email": current_user.email,
            "monthly_budget": current_user.monthly_budget,
            "goal": current_user.goal,
            "food_preference": current_user.food_preference,
            "target_calories": current_user.target_calories,
            "target_protein": current_user.target_protein
        }
    }
