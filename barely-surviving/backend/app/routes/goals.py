from fastapi import APIRouter, HTTPException
from typing import Optional
from datetime import datetime
from beanie import PydanticObjectId

from app.models.goal import Goal
from app.models.weight import Weight
from app.schemas.requests import GoalCreate, GoalUpdate

router = APIRouter(prefix="/goals", tags=["goals"])


@router.post("", response_model=Goal, status_code=201)
async def create_or_update_goal(goal_data: GoalCreate):
    """Create or update goals (only one goal set per user in Phase 1)"""
    # Check if a goal already exists
    existing_goal = await Goal.find_one()
    
    goal_dict = goal_data.model_dump()
    
    if existing_goal:
        # Update existing goal
        goal_dict["updated_at"] = datetime.utcnow()
        await existing_goal.set(goal_dict)
        return existing_goal
    else:
        # Create new goal
        goal = Goal(**goal_dict)
        await goal.insert()
        return goal


@router.get("", response_model=Optional[Goal])
async def get_goals():
    """Get current goals"""
    goal = await Goal.find_one()
    return goal


@router.get("/progress")
async def get_progress():
    """Calculate progress towards goal"""
    goal = await Goal.find_one()
    
    if not goal:
        raise HTTPException(status_code=404, detail="No goals set")
    
    # Get latest weight
    latest_weight = await Weight.find_one(sort=[("date", -1)])
    
    if not latest_weight:
        current_weight = goal.start_weight
    else:
        current_weight = latest_weight.weight
    
    # Calculate progress
    total_to_lose = goal.start_weight - goal.target_weight
    lost_so_far = goal.start_weight - current_weight
    remaining = current_weight - goal.target_weight
    
    if total_to_lose != 0:
        percent_complete = (lost_so_far / total_to_lose) * 100
    else:
        percent_complete = 100 if lost_so_far >= 0 else 0
    
    return {
        "goal": goal,
        "current_weight": current_weight,
        "start_weight": goal.start_weight,
        "target_weight": goal.target_weight,
        "total_to_lose": round(total_to_lose, 2),
        "lost_so_far": round(lost_so_far, 2),
        "remaining": round(remaining, 2),
        "percent_complete": round(percent_complete, 1)
    }


@router.put("/{goal_id}", response_model=Goal)
async def update_goal(goal_id: PydanticObjectId, goal_data: GoalUpdate):
    """Update specific goal"""
    goal = await Goal.get(goal_id)
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    
    update_data = goal_data.model_dump(exclude_unset=True)
    if update_data:
        update_data["updated_at"] = datetime.utcnow()
        await goal.set(update_data)
    
    return goal


@router.delete("/{goal_id}", status_code=204)
async def delete_goal(goal_id: PydanticObjectId):
    """Delete a goal"""
    goal = await Goal.get(goal_id)
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    
    await goal.delete()
    return None
