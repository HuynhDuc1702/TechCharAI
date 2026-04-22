
from core.database import db
from schemas.character import CharacterDetail


async def get_character(character_id:str)-> CharacterDetail:
    character= await db["character"].find_one({"_id":character_id})
    return CharacterDetail(
        name=character["name"],
        character_prompt=character["system_prompt"],
        personality=character["personality"],
        description=character["description"]
    )
    
    