from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from datetime import datetime, date
from beanie import PydanticObjectId

from app.models.meal import Meal
from app.schemas.requests import MealCreate, MealUpdate

router = APIRouter(prefix="/meals", tags=["meals"])


@router.post("", response_model=Meal, status_code=201)
async def create_meal(meal_data: MealCreate):
    """Create a new meal entry"""
    meal_dict = meal_data.model_dump()
    if meal_dict.get("date") is None:
        meal_dict["date"] = datetime.utcnow()
    
    meal = Meal(**meal_dict)
    await meal.insert()
    return meal


@router.get("", response_model=List[Meal])
async def list_meals(
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    meal_type: Optional[str] = Query(None),
    limit: int = Query(100, le=500)
):
    """List meals with optional filtering"""
    query = {}
    
    if start_date or end_date:
        date_query = {}
        if start_date:
            date_query["$gte"] = datetime.combine(start_date, datetime.min.time())
        if end_date:
            date_query["$lte"] = datetime.combine(end_date, datetime.max.time())
        query["date"] = date_query
    
    if meal_type:
        query["type"] = meal_type
    
    meals = await Meal.find(query).sort("-date").limit(limit).to_list()
    return meals


@router.get("/daily-summary")
async def get_daily_summary(target_date: Optional[date] = Query(None)):
    """Get daily nutrition summary"""
    if target_date is None:
        target_date = date.today()
    
    start_datetime = datetime.combine(target_date, datetime.min.time())
    end_datetime = datetime.combine(target_date, datetime.max.time())
    
    meals = await Meal.find({
        "date": {"$gte": start_datetime, "$lte": end_datetime}
    }).to_list()
    
    total_calories = sum(meal.calories for meal in meals)
    total_protein = sum(meal.protein for meal in meals)
    total_carbs = sum(meal.carbs or 0 for meal in meals)
    total_fat = sum(meal.fat or 0 for meal in meals)
    
    return {
        "date": target_date,
        "total_calories": total_calories,
        "total_protein": total_protein,
        "total_carbs": total_carbs,
        "total_fat": total_fat,
        "meal_count": len(meals)
    }


@router.get("/{meal_id}", response_model=Meal)
async def get_meal(meal_id: PydanticObjectId):
    """Get a single meal by ID"""
    meal = await Meal.get(meal_id)
    if not meal:
        raise HTTPException(status_code=404, detail="Meal not found")
    return meal


@router.put("/{meal_id}", response_model=Meal)
async def update_meal(meal_id: PydanticObjectId, meal_data: MealUpdate):
    """Update a meal"""
    meal = await Meal.get(meal_id)
    if not meal:
        raise HTTPException(status_code=404, detail="Meal not found")
    
    update_data = meal_data.model_dump(exclude_unset=True)
    if update_data:
        update_data["updated_at"] = datetime.utcnow()
        await meal.set(update_data)
    
    return meal


@router.delete("/{meal_id}", status_code=204)
async def delete_meal(meal_id: PydanticObjectId):
    """Delete a meal"""
    meal = await Meal.get(meal_id)
    if not meal:
        raise HTTPException(status_code=404, detail="Meal not found")
    
    await meal.delete()
    return None
