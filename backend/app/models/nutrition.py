from sqlalchemy import Column, Integer, String, Float
from ..core.database import Base

class Nutrition(Base):
    __tablename__ = "nutrition"

    id = Column(Integer, primary_key=True, index=True)
    meal_name = Column(String, index=True)
    calories = Column(Float)
    protein = Column(Float)
    carbs = Column(Float)
    fat = Column(Float)
    health_score = Column(Float)
