from pydantic import BaseModel
from typing import Optional

class CharacterDetail(BaseModel):
    name: str
    character_prompt:str
    personality:Optional[str]=None
    description:Optional[str]=None