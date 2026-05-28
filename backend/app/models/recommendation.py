from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from datetime import datetime
from ..core.database import Base

class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    prompt = Column(String)
    recommendation = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)
