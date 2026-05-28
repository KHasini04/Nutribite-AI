from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..core.database import get_db
from ..models.user import User
from ..auth.dependencies import get_current_user
from pydantic import BaseModel

router = APIRouter(prefix="/budget", tags=["Budget"])

class BudgetUpdate(BaseModel):
    monthly_budget: float

@router.get("/")
def get_budget(current_user: User = Depends(get_current_user)):
    return {"monthly_budget": current_user.monthly_budget}

@router.put("/")
def update_budget(budget_data: BudgetUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    current_user.monthly_budget = budget_data.monthly_budget
    db.commit()
    db.refresh(current_user)
    return {"message": "Budget updated successfully", "monthly_budget": current_user.monthly_budget}
