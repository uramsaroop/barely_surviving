from beanie import Document
from pydantic import Field
from datetime import datetime
from typing import Optional


class Workout(Document):
    type: str = Field(..., description="Workout type: cardio, strength, flexibility, sports, other")
    name: str = Field(..., description="Workout name/title")
    duration: int = Field(..., description="Duration in minutes")
    calories_burned: int = Field(default=0, description="Estimated calories burned")
    notes: Optional[str] = Field(default="", description="Additional notes")
    date: datetime = Field(default_factory=datetime.utcnow, description="Workout date/time")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Settings:
        name = "workouts"
        indexes = [
            "date",
            "type",
        ]
    
    class Config:
        json_schema_extra = {
            "example": {
                "type": "cardio",
                "name": "Morning Run",
                "duration": 30,
                "calories_burned": 245,
                "notes": "Felt great!",
                "date": "2026-02-09T08:00:00Z"
            }
        }
