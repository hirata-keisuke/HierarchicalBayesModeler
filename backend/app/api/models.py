from fastapi import APIRouter, HTTPException, Header
from typing import Optional
from app.models.schemas import ModelCreate, ModelResponse
from app.services.model_service import ModelService

router = APIRouter()

@router.post("", response_model=ModelResponse)
async def create_model(
    model_data: ModelCreate,
    x_session_id: Optional[str] = Header(None)
):
    """新しいモデルを作成"""
    if not x_session_id:
        raise HTTPException(status_code=400, detail="Session ID is required")

    service = ModelService(x_session_id)
    return await service.create_model(model_data)

@router.get("/{model_id}", response_model=ModelResponse)
async def get_model(
    model_id: str,
    x_session_id: Optional[str] = Header(None)
):
    """モデル情報を取得"""
    if not x_session_id:
        raise HTTPException(status_code=400, detail="Session ID is required")

    service = ModelService(x_session_id)
    return await service.get_model(model_id)

@router.delete("/{model_id}")
async def delete_model(
    model_id: str,
    x_session_id: Optional[str] = Header(None)
):
    """モデルを削除"""
    if not x_session_id:
        raise HTTPException(status_code=400, detail="Session ID is required")

    service = ModelService(x_session_id)
    await service.delete_model(model_id)
    return {"message": "Model deleted successfully"}
