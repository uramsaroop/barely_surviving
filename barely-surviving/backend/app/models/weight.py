from beanie import Document
from pydantic import Field
from datetime import datetime
from datetime import date as date_type


class Weight(Document):
    weight: float = Field(..., description="Weight in pounds")
    date: date_type = Field(default_factory=lambda: datetime.utcnow().date(), description="Weight measurement date")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Settings:
        name = "weights"
        indexes = [
            "date",
        ]
    
    class Config:
        json_schema_extra = {
            "example": {
                "weight": 167.5,
                "date": "2026-02-09"
            }
        }
