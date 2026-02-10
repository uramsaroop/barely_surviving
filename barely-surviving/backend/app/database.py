from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.config import settings
from app.models.workout import Workout
from app.models.meal import Meal
from app.models.weight import Weight
from app.models.goal import Goal


class Database:
    client: AsyncIOMotorClient = None


db = Database()


async def connect_to_mongo():
    """Connect to MongoDB and initialize Beanie"""
    db.client = AsyncIOMotorClient(settings.mongodb_uri)
    
    await init_beanie(
        database=db.client[settings.mongodb_db_name],
        document_models=[Workout, Meal, Weight, Goal]
    )
    print(f"Connected to MongoDB: {settings.mongodb_db_name}")


async def close_mongo_connection():
    """Close MongoDB connection"""
    if db.client:
        db.client.close()
        print("Closed MongoDB connection")
