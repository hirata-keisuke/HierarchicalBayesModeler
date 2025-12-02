from fastapi import APIRouter
from typing import List
from app.models.schemas import DistributionDefinition
from app.services.distribution_service import DistributionService

router = APIRouter()

@router.get("", response_model=List[DistributionDefinition])
async def get_distributions():
    """利用可能な分布一覧を取得"""
    service = DistributionService()
    return service.get_all_distributions()
