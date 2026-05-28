from pydantic import BaseModel
from datetime import datetime

class OrderBase(BaseModel):
    restaurant: str
    meal_name: str
    amount: float
    calories: int = 0
    protein: int = 0
    carbs: int = 0
    fat: int = 0

class OrderCreate(OrderBase):
    pass

class OrderResponse(OrderBase):
    id: int
    user_id: int
    date: datetime

    class Config:
        from_attributes = True
