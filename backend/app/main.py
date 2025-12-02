from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import models, nodes, data, inference, distributions, operations
from app.config import settings

app = FastAPI(
    title="階層ベイズモデルGUI API",
    description="グラフィカルモデル構築とPyMC推論のためのAPI",
    version="0.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(models.router, prefix="/api/models", tags=["models"])
app.include_router(nodes.router, prefix="/api/models", tags=["nodes"])
app.include_router(data.router, prefix="/api/data", tags=["data"])
app.include_router(inference.router, prefix="/api", tags=["inference"])
app.include_router(distributions.router, prefix="/api/distributions", tags=["distributions"])
app.include_router(operations.router, prefix="/api/operations", tags=["operations"])

@app.get("/")
async def root():
    return {"message": "階層ベイズモデルGUI API", "version": "0.1.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
