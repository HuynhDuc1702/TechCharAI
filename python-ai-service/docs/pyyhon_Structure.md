python-ai-service/
├── .env                     # Environment variables
├── .gitignore               # Git ignore file
├── requirement.txt          # Python dependencies
├── main.py                  # FastAPI app entrypoint
├── core/
│   ├── __init__.py
│   ├── config.py            # Environment config settings
│   └── database.py          # Database connections and sessions
├── models/
│   ├── __init__.py
│   └── character.py         # Pydantic models
├── routers/
│   ├── __init__.py
│   └── message.py           # Message/Chat API endpoints
├── agents/
│   ├── __init__.py
│   ├── orchestrator.py      # ReAct loop (Thought → Action → Observe)
│   └── tools/
│       ├── __init__.py
│       ├── build_context.py # Fetch + sort from MongoDB
│       ├── embed.py         # MiniLM embedding
│       ├── memory_store.py  # Pinecone upsert
│       └── vector_search.py # Pinecone query
├── services/
│   ├── __init__.py
│   ├── character.py         # Fetch character details
│   └── llm.py               # GLM-5.1 caller
└── docs/
    └── pyyhon_Structure.md  # Documentation