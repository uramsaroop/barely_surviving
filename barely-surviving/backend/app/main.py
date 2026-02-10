from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.config import settings
from app.database import connect_to_mongo, close_mongo_connection
from app.routes import (
    workouts_router,
    meals_router,
    weight_router,
    goals_router,
    dashboard_router,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await connect_to_mongo()
    yield
    # Shutdown
    await close_mongo_connection()


app = FastAPI(
    title="Barely Surviving API",
    description="API for tracking workouts, nutrition, and progress towards fitness goals - because we're all just barely surviving",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check endpoints
@app.get("/health")
async def health_check():
    """Basic health check"""
    return {"status": "healthy", "service": "barely-surviving-api"}


@app.get(f"{settings.api_v1_prefix}/health")
async def api_health_check():
    """API health check"""
    return {"status": "healthy", "version": "1.0.0"}


# Include routers
app.include_router(workouts_router, prefix=settings.api_v1_prefix)
app.include_router(meals_router, prefix=settings.api_v1_prefix)
app.include_router(weight_router, prefix=settings.api_v1_prefix)
app.include_router(goals_router, prefix=settings.api_v1_prefix)
app.include_router(dashboard_router, prefix=settings.api_v1_prefix)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
