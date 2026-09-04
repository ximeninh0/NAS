from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import Base, engine
from app.routers import auth, files

Base.metadata.create_all(bind=engine)

app = FastAPI(title="NAS API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_ORIGIN],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth")
app.include_router(files.router, prefix="/files")


@app.get("/health")
def health():
    return {"status": "ok"}


# uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
