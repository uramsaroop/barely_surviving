from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # MongoDB
    mongodb_uri: str = "mongodb://localhost:27017"
    mongodb_db_name: str = "fitness_tracker"
    
    # CORS
    cors_origins: str = "http://localhost:5173,http://localhost:3000"
    
    # API
    api_v1_prefix: str = "/api/v1"
    
    # Anthropic (Phase 2)
    anthropic_api_key: Optional[str] = None
    
    # Logging
    log_level: str = "INFO"
    
    class Config:
        env_file = ".env"
        case_sensitive = False
    
    @property
    def cors_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",")]


settings = Settings()
