from pydantic import BaseModel

class NutritionBase(BaseModel):
    meal_name: str
    calories: float
    protein: float
    carbs: float
    fat: float
    health_score: float

class NutritionCreate(NutritionBase):
    pass

class NutritionResponse(NutritionBase):
    id: int

    class Config:
        from_attributes = True
