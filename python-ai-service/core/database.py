from motor.motor_asyncio import AsyncIOMotorClient

from core.config import DATABASE_URL

MONGO_URL = DATABASE_URL

if MONGO_URL is None:
    print("Database URL is empty")
client=None
db=None

async def connect_db():
    global client, db
    client=AsyncIOMotorClient(MONGO_URL)
    db=client.get_default_database()
    print("Connected to Database")
async def disconnect_db():
    global client
    if client:
        client.close()
    print("Disconnected to Database")