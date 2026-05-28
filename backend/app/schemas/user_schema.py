from pydantic import BaseModel, EmailStr
from typing import Optional

class UserBase(BaseModel):
    name: str
    email: EmailStr
    monthly_budget: Optional[float] = 0.0
    food_preference: Optional[str] = "Any"
    goal: Optional[str] = "None"
    target_calories: Optional[int] = 2000
    target_protein: Optional[int] = 100

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    id: int

    class Config:
        from_attributes = True
