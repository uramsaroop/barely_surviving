from beanie import Document
from pydantic import Field
from datetime import datetime
from typing import Optional


class Meal(Document):
    type: str = Field(..., description="Meal type: breakfast, lunch, dinner, snack")
    description: str = Field(..., description="Meal description")
    calories: int = Field(..., description="Total calories")
    protein: int = Field(default=0, description="Protein in grams")
    carbs: Optional[int] = Field(default=None, description="Carbohydrates in grams")
    fat: Optional[int] = Field(default=None, description="Fat in grams")
    notes: Optional[str] = Field(default="", description="Additional notes")
    date: datetime = Field(default_factory=datetime.utcnow, description="Meal date/time")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Settings:
        name = "meals"
        indexes = [
            "date",
            "type",
        ]
    
    class Config:
        json_schema_extra = {
            "example": {
                "type": "lunch",
                "description": "Grilled chicken salad with avocado",
                "calories": 450,
                "protein": 35,
                "carbs": 25,
                "fat": 18,
                "notes": "From meal prep",
                "date": "2026-02-09T12:30:00Z"
            }
        }
