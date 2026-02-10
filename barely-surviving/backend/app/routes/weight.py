from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from datetime import datetime, date, timedelta
from beanie import PydanticObjectId

from app.models.weight import Weight
from app.schemas.requests import WeightCreate

router = APIRouter(prefix="/weight", tags=["weight"])


@router.post("", response_model=Weight, status_code=201)
async def create_weight(weight_data: WeightCreate):
    """Log a new weight entry"""
    weight_dict = weight_data.model_dump()
    if weight_dict.get("date") is None:
        weight_dict["date"] = date.today()
    
    weight = Weight(**weight_dict)
    await weight.insert()
    return weight


@router.get("", response_model=List[Weight])
async def list_weights(
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    limit: int = Query(100, le=500)
):
    """List weight entries with optional filtering"""
    query = {}
    
    if start_date or end_date:
        date_query = {}
        if start_date:
            date_query["$gte"] = start_date
        if end_date:
            date_query["$lte"] = end_date
        query["date"] = date_query
    
    weights = await Weight.find(query).sort("-date").limit(limit).to_list()
    return weights


@router.get("/trend")
async def get_weight_trend(days: int = Query(7, ge=1, le=365)):
    """Get weight trend over specified number of days"""
    end_date = date.today()
    start_date = end_date - timedelta(days=days)
    
    weights = await Weight.find({
        "date": {"$gte": start_date, "$lte": end_date}
    }).sort("date").to_list()
    
    if not weights:
        return {
            "start_date": start_date,
            "end_date": end_date,
            "data_points": 0,
            "trend": []
        }
    
    # Calculate trend
    trend_data = [
        {
            "date": w.date,
            "weight": w.weight
        }
        for w in weights
    ]
    
    # Calculate change
    start_weight = weights[0].weight if weights else 0
    current_weight = weights[-1].weight if weights else 0
    change = current_weight - start_weight
    
    return {
        "start_date": start_date,
        "end_date": end_date,
        "data_points": len(weights),
        "start_weight": start_weight,
        "current_weight": current_weight,
        "change": round(change, 2),
        "trend": trend_data
    }


@router.get("/{weight_id}", response_model=Weight)
async def get_weight(weight_id: PydanticObjectId):
    """Get a single weight entry by ID"""
    weight = await Weight.get(weight_id)
    if not weight:
        raise HTTPException(status_code=404, detail="Weight entry not found")
    return weight


@router.delete("/{weight_id}", status_code=204)
async def delete_weight(weight_id: PydanticObjectId):
    """Delete a weight entry"""
    weight = await Weight.get(weight_id)
    if not weight:
        raise HTTPException(status_code=404, detail="Weight entry not found")
    
    await weight.delete()
    return None
