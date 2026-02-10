from beanie import Document
from pydantic import Field
from datetime import datetime, date
from typing import Optional


class Goal(Document):
    start_weight: float = Field(..., description="Starting weight in pounds")
    target_weight: float = Field(..., description="Target weight in pounds")
    target_date: Optional[date] = Field(default=None, description="Target date to reach goal")
    daily_calorie_goal: Optional[int] = Field(default=None, description="Daily calorie target")
    weekly_workouts: Optional[int] = Field(default=None, description="Target workouts per week")
    active_days_per_week: Optional[int] = Field(default=None, description="Target active days per week")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Settings:
        name = "goals"
    
    class Config:
        json_schema_extra = {
            "example": {
                "start_weight": 200.0,
                "target_weight": 170.0,
                "target_date": "2026-06-01",
                "daily_calorie_goal": 2000,
                "weekly_workouts": 4,
                "active_days_per_week": 5
            }
        }
