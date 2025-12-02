from pydantic_settings import BaseSettings
from pydantic import field_validator
from typing import List, Union
import json

class Settings(BaseSettings):
    REDIS_URL: str = "redis://localhost:6379"
    CELERY_BROKER_URL: str = "redis://localhost:6379/0"
    CELERY_RESULT_BACKEND: str = "redis://localhost:6379/0"

    SESSION_TIMEOUT: int = 86400
    MAX_FILE_SIZE: int = 104857600
    STORAGE_PATH: str = "/app/storage"

    CORS_ORIGINS: Union[str, List[str]] = ["http://localhost:3000", "http://localhost"]

    @field_validator('CORS_ORIGINS', mode='before')
    @classmethod
    def parse_cors_origins(cls, v):
        if isinstance(v, str):
            if v.startswith("["):
                return json.loads(v)
            else:
                return [origin.strip() for origin in v.split(",")]
        return v

    class Config:
        env_file = ".env"

settings = Settings()
