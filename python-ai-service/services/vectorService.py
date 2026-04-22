from pinecone import Pinecone
from core.config import settings
from agents.tools.embed import get_embedding
from typing import List

try:
    pc = Pinecone(api_key=settings.PINECONE_API_KEY)
    index = pc.Index(settings.PINECONE_INDEX_NAME)
except Exception as e:
    raise RuntimeError(f"Failed to connect to Pinecone: {e}")

async def upsert_vector(message_id:str, content:str, session_id:str):
    try:
        vector=await get_embedding(content)
        index.upsert(vectors=[{
            "id":message_id,
            "values":vector,
            "metadata":{
            "text":content,
            "session_id":session_id,
            },
        }])
    except Exception as e:
        print(f"Failed to upsert vector message {message_id}: {e}")
   
    
async def update_vector(message_id:str, content:str, session_id:str):
    try:
        await upsert_vector(message_id,content,session_id)
    except Exception as e:
        print(f"Failed to update vector message {message_id}: {e}")
   
    
async def delete_vector(message_ids:List[str]):
    try:
        index.delete(ids=message_ids)
    except Exception as e:
        print(f"Failed to update vector messages: {e}")
   
   