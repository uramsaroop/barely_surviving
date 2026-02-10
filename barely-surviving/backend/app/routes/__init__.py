from app.routes.workouts import router as workouts_router
from app.routes.meals import router as meals_router
from app.routes.weight import router as weight_router
from app.routes.goals import router as goals_router
from app.routes.dashboard import router as dashboard_router

__all__ = [
    "workouts_router",
    "meals_router",
    "weight_router",
    "goals_router",
    "dashboard_router",
]
