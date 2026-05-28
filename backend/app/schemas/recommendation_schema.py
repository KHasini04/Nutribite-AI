from pydantic import BaseModel
from datetime import datetime

class RecommendationBase(BaseModel):
    prompt: str

class RecommendationCreate(RecommendationBase):
    pass

class RecommendationResponse(RecommendationBase):
    recommendation: str
    id: int
    user_id: int
    timestamp: datetime

    class Config:
        from_attributes = True
