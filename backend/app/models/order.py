from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from ..core.database import Base

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    restaurant = Column(String)
    meal_name = Column(String)
    amount = Column(Float)
    calories = Column(Integer, default=0)
    protein = Column(Integer, default=0)
    carbs = Column(Integer, default=0)
    fat = Column(Integer, default=0)
    date = Column(DateTime, default=datetime.utcnow)

    # user = relationship("User", back_populates="orders")
