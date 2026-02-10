from fastapi import APIRouter, Query
from typing import Optional, List, Dict, Any
from datetime import datetime, date, timedelta

from app.models.workout import Workout
from app.models.meal import Meal
from app.models.weight import Weight

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/stats")
async def get_dashboard_stats(target_date: Optional[date] = Query(None)):
    """Get dashboard statistics for a specific date"""
    if target_date is None:
        target_date = date.today()
    
    start_datetime = datetime.combine(target_date, datetime.min.time())
    end_datetime = datetime.combine(target_date, datetime.max.time())
    
    # Get today's workouts
    workouts = await Workout.find({
        "date": {"$gte": start_datetime, "$lte": end_datetime}
    }).to_list()
    
    # Get today's meals
    meals = await Meal.find({
        "date": {"$gte": start_datetime, "$lte": end_datetime}
    }).to_list()
    
    # Get latest weight
    latest_weight = await Weight.find_one(sort=[("date", -1)])
    
    # Calculate totals
    total_calories = sum(meal.calories for meal in meals)
    total_protein = sum(meal.protein for meal in meals)
    workout_count = len(workouts)
    calories_burned = sum(workout.calories_burned for workout in workouts)
    
    return {
        "date": target_date,
        "calories_consumed": total_calories,
        "protein_consumed": total_protein,
        "workout_count": workout_count,
        "calories_burned": calories_burned,
        "current_weight": latest_weight.weight if latest_weight else None,
        "meal_count": len(meals)
    }


@router.get("/streak")
async def calculate_streak():
    """Calculate current activity streak"""
    # Get all unique dates with activity (workouts or meals)
    workout_dates = await Workout.distinct("date")
    meal_dates = await Meal.distinct("date")
    
    # Convert to date objects and combine
    activity_dates = set()
    
    for dt in workout_dates:
        if isinstance(dt, datetime):
            activity_dates.add(dt.date())
    
    for dt in meal_dates:
        if isinstance(dt, datetime):
            activity_dates.add(dt.date())
    
    if not activity_dates:
        return {
            "streak": 0,
            "last_activity_date": None
        }
    
    # Calculate streak from today backwards
    current_date = date.today()
    streak = 0
    
    # Check if there's activity today or yesterday to start streak
    if current_date not in activity_dates and (current_date - timedelta(days=1)) not in activity_dates:
        return {
            "streak": 0,
            "last_activity_date": max(activity_dates) if activity_dates else None
        }
    
    # Count consecutive days
    check_date = current_date
    while check_date in activity_dates:
        streak += 1
        check_date -= timedelta(days=1)
    
    return {
        "streak": streak,
        "last_activity_date": current_date if current_date in activity_dates else current_date - timedelta(days=1)
    }


@router.get("/recent-activity")
async def get_recent_activity(limit: int = Query(10, le=50)):
    """Get recent activity feed combining workouts, meals, and weight entries"""
    # Get recent workouts
    recent_workouts = await Workout.find().sort("-date").limit(limit).to_list()
    
    # Get recent meals
    recent_meals = await Meal.find().sort("-date").limit(limit).to_list()
    
    # Get recent weights
    recent_weights = await Weight.find().sort("-date").limit(limit).to_list()
    
    # Combine and format
    activity_feed: List[Dict[str, Any]] = []
    
    for workout in recent_workouts:
        activity_feed.append({
            "type": "workout",
            "id": str(workout.id),
            "title": workout.name,
            "details": f"{workout.duration} min • {workout.calories_burned} cal burned",
            "date": workout.date,
            "icon": "🏃"
        })
    
    for meal in recent_meals:
        activity_feed.append({
            "type": "meal",
            "id": str(meal.id),
            "title": meal.description,
            "details": f"{meal.calories} cal • {meal.protein}g protein",
            "date": meal.date,
            "icon": "🍽️"
        })
    
    for weight in recent_weights:
        activity_feed.append({
            "type": "weight",
            "id": str(weight.id),
            "title": "Weight Check",
            "details": f"{weight.weight} lbs",
            "date": datetime.combine(weight.date, datetime.min.time()),
            "icon": "⚖️"
        })
    
    # Sort by date descending
    activity_feed.sort(key=lambda x: x["date"], reverse=True)
    
    # Limit results
    activity_feed = activity_feed[:limit]
    
    return {
        "activities": activity_feed,
        "count": len(activity_feed)
    }
