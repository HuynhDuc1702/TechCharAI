import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL=os.getenv("DATABASE_URL")
PINECONE_API=os.getenv("PINECONE_API")
GLM_API=os.getenv("GLM_API")