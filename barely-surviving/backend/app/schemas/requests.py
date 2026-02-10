from pydantic import BaseModel, Field
from datetime import datetime, date
from typing import Optional


# Workout Schemas
class WorkoutCreate(BaseModel):
    type: str = Field(..., description="cardio, strength, flexibility, sports, other")
    name: str
    duration: int = Field(..., gt=0)
    calories_burned: int = Field(default=0, ge=0)
    notes: Optional[str] = ""
    date: Optional[datetime] = None


class WorkoutUpdate(BaseModel):
    type: Optional[str] = None
    name: Optional[str] = None
    duration: Optional[int] = Field(None, gt=0)
    calories_burned: Optional[int] = Field(None, ge=0)
    notes: Optional[str] = None
    date: Optional[datetime] = None


# Meal Schemas
class MealCreate(BaseModel):
    type: str = Field(..., description="breakfast, lunch, dinner, snack")
    description: str
    calories: int = Field(..., ge=0)
    protein: int = Field(default=0, ge=0)
    carbs: Optional[int] = Field(None, ge=0)
    fat: Optional[int] = Field(None, ge=0)
    notes: Optional[str] = ""
    date: Optional[datetime] = None


class MealUpdate(BaseModel):
    type: Optional[str] = None
    description: Optional[str] = None
    calories: Optional[int] = Field(None, ge=0)
    protein: Optional[int] = Field(None, ge=0)
    carbs: Optional[int] = Field(None, ge=0)
    fat: Optional[int] = Field(None, ge=0)
    notes: Optional[str] = None
    date: Optional[datetime] = None


# Weight Schemas
class WeightCreate(BaseModel):
    weight: float = Field(..., gt=0)
    date: Optional[date] = None


# Goal Schemas
class GoalCreate(BaseModel):
    start_weight: float = Field(..., gt=0)
    target_weight: float = Field(..., gt=0)
    target_date: Optional[date] = None
    daily_calorie_goal: Optional[int] = Field(None, gt=0)
    weekly_workouts: Optional[int] = Field(None, ge=0, le=7)
    active_days_per_week: Optional[int] = Field(None, ge=0, le=7)


class GoalUpdate(BaseModel):
    start_weight: Optional[float] = Field(None, gt=0)
    target_weight: Optional[float] = Field(None, gt=0)
    target_date: Optional[date] = None
    daily_calorie_goal: Optional[int] = Field(None, gt=0)
    weekly_workouts: Optional[int] = Field(None, ge=0, le=7)
    active_days_per_week: Optional[int] = Field(None, ge=0, le=7)
