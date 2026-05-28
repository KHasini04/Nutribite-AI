from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    SWIGGY_API_URL: str
    NUTRITIONIX_APP_ID: str
    NUTRITIONIX_API_KEY: str
    GEMINI_API_KEY: str

    class Config:
        env_file = ".env"

settings = Settings()
