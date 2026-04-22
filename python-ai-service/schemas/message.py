from pydantic import BaseModel
from typing import Optional

class UserMessageRequest(BaseModel):
    session_id:str
    character_id:str
    content:str
class MessageResponse(BaseModel):
    role:str
    content:str