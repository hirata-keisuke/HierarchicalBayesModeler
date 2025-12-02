from fastapi import APIRouter
from typing import List
from app.models.schemas import OperationDefinition
from app.services.operation_service import OperationService

router = APIRouter()

@router.get("", response_model=List[OperationDefinition])
async def get_operations():
    """利用可能な演算一覧を取得"""
    service = OperationService()
    return service.get_all_operations()
