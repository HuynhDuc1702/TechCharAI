from typing import List
from bson import ObjectId
from core.database import db
from schemas.message import MessageResponse

async def get_messages_by_ids(ids: List[str]):
    #convert ids into object id
    object_ids = [ObjectId(i) for i in ids]   
    data = [
       m
        async for m in db.messages.find({
            "_id": {"$in": object_ids}
        }).sort("createdAt", 1)
    ]
    messages = [map_message(d) for d in data]
    return messages

async def get_last_messages(sessionId:str, quantity:int):
    messages=[]
    object_id=ObjectId(sessionId)
    
    async for m in db.messages.find({
        "sessionId":object_id
    }).sort("createdAt",-1).limit(quantity):
        messages.append(map_message(m))
    messages.reverse()
    return messages
    

def map_message(m)-> MessageResponse:
    return MessageResponse(
        role=m["role"],
        content=m["content"]
    )
