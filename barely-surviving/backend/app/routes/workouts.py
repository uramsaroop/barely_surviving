from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from datetime import datetime, date
from beanie import PydanticObjectId

from app.models.workout import Workout
from app.schemas.requests import WorkoutCreate, WorkoutUpdate

router = APIRouter(prefix="/workouts", tags=["workouts"])


@router.post("", response_model=Workout, status_code=201)
async def create_workout(workout_data: WorkoutCreate):
    """Create a new workout entry"""
    workout_dict = workout_data.model_dump()
    if workout_dict.get("date") is None:
        workout_dict["date"] = datetime.utcnow()
    
    workout = Workout(**workout_dict)
    await workout.insert()
    return workout


@router.get("", response_model=List[Workout])
async def list_workouts(
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    workout_type: Optional[str] = Query(None),
    limit: int = Query(100, le=500)
):
    """List workouts with optional filtering"""
    query = {}
    
    if start_date or end_date:
        date_query = {}
        if start_date:
            date_query["$gte"] = datetime.combine(start_date, datetime.min.time())
        if end_date:
            date_query["$lte"] = datetime.combine(end_date, datetime.max.time())
        query["date"] = date_query
    
    if workout_type:
        query["type"] = workout_type
    
    workouts = await Workout.find(query).sort("-date").limit(limit).to_list()
    return workouts


@router.get("/{workout_id}", response_model=Workout)
async def get_workout(workout_id: PydanticObjectId):
    """Get a single workout by ID"""
    workout = await Workout.get(workout_id)
    if not workout:
        raise HTTPException(status_code=404, detail="Workout not found")
    return workout


@router.put("/{workout_id}", response_model=Workout)
async def update_workout(workout_id: PydanticObjectId, workout_data: WorkoutUpdate):
    """Update a workout"""
    workout = await Workout.get(workout_id)
    if not workout:
        raise HTTPException(status_code=404, detail="Workout not found")
    
    update_data = workout_data.model_dump(exclude_unset=True)
    if update_data:
        update_data["updated_at"] = datetime.utcnow()
        await workout.set(update_data)
    
    return workout


@router.delete("/{workout_id}", status_code=204)
async def delete_workout(workout_id: PydanticObjectId):
    """Delete a workout"""
    workout = await Workout.get(workout_id)
    if not workout:
        raise HTTPException(status_code=404, detail="Workout not found")
    
    await workout.delete()
    return None
