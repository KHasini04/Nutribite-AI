from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..core.database import get_db
from ..models.user import User
from ..models.recommendation import Recommendation
from ..schemas.recommendation_schema import RecommendationCreate, RecommendationResponse
from ..auth.dependencies import get_current_user
from ..services.ai_service import get_ai_recommendation

router = APIRouter(prefix="/recommend", tags=["Recommendations"])

@router.post("/", response_model=RecommendationResponse)
async def create_recommendation(request: RecommendationCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    ai_response = await get_ai_recommendation(
        prompt=request.prompt,
        user_budget=current_user.monthly_budget,
        user_preference=current_user.food_preference,
        user_goal=current_user.goal
    )
    
    new_rec = Recommendation(
        user_id=current_user.id,
        prompt=request.prompt,
        recommendation=ai_response
    )
    db.add(new_rec)
    db.commit()
    db.refresh(new_rec)
    return new_rec

@router.get("/", response_model=List[RecommendationResponse])
def get_recommendations(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    recs = db.query(Recommendation).filter(Recommendation.user_id == current_user.id).all()
    return recs
