from sqlalchemy import Column, Integer, String, Float
from ..core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)
    monthly_budget = Column(Float, default=0.0)
    food_preference = Column(String, default="Any")
    goal = Column(String, default="None")
    target_calories = Column(Integer, default=2000)
    target_protein = Column(Integer, default=100)
