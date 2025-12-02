from fastapi import APIRouter, HTTPException, Header
from typing import Optional, List
from app.models.schemas import NodeCreate, NodeUpdate, NodeResponse, EdgeCreate, EdgeResponse
from app.services.node_service import NodeService

router = APIRouter()

@router.post("/{model_id}/nodes", response_model=NodeResponse)
async def create_node(
    model_id: str,
    node_data: NodeCreate,
    x_session_id: Optional[str] = Header(None)
):
    """ノードを作成"""
    if not x_session_id:
        raise HTTPException(status_code=400, detail="Session ID is required")

    service = NodeService(x_session_id)
    return await service.create_node(model_id, node_data)

@router.get("/{model_id}/nodes", response_model=List[NodeResponse])
async def get_nodes(
    model_id: str,
    x_session_id: Optional[str] = Header(None)
):
    """モデルの全ノードを取得"""
    if not x_session_id:
        raise HTTPException(status_code=400, detail="Session ID is required")

    service = NodeService(x_session_id)
    return await service.get_all_nodes(model_id)

@router.put("/{model_id}/nodes/{node_id}", response_model=NodeResponse)
async def update_node(
    model_id: str,
    node_id: str,
    node_data: NodeUpdate,
    x_session_id: Optional[str] = Header(None)
):
    """ノードを更新"""
    if not x_session_id:
        raise HTTPException(status_code=400, detail="Session ID is required")

    service = NodeService(x_session_id)
    return await service.update_node(model_id, node_id, node_data)

@router.delete("/{model_id}/nodes/{node_id}")
async def delete_node(
    model_id: str,
    node_id: str,
    x_session_id: Optional[str] = Header(None)
):
    """ノードを削除"""
    if not x_session_id:
        raise HTTPException(status_code=400, detail="Session ID is required")

    service = NodeService(x_session_id)
    await service.delete_node(model_id, node_id)
    return {"message": "Node deleted successfully"}

@router.post("/{model_id}/edges", response_model=EdgeResponse)
async def create_edge(
    model_id: str,
    edge_data: EdgeCreate,
    x_session_id: Optional[str] = Header(None)
):
    """エッジを作成"""
    if not x_session_id:
        raise HTTPException(status_code=400, detail="Session ID is required")

    service = NodeService(x_session_id)
    return await service.create_edge(model_id, edge_data)

@router.get("/{model_id}/edges", response_model=List[EdgeResponse])
async def get_edges(
    model_id: str,
    x_session_id: Optional[str] = Header(None)
):
    """モデルの全エッジを取得"""
    if not x_session_id:
        raise HTTPException(status_code=400, detail="Session ID is required")

    service = NodeService(x_session_id)
    return await service.get_all_edges(model_id)

@router.delete("/{model_id}/edges/{edge_id}")
async def delete_edge(
    model_id: str,
    edge_id: str,
    x_session_id: Optional[str] = Header(None)
):
    """エッジを削除"""
    if not x_session_id:
        raise HTTPException(status_code=400, detail="Session ID is required")

    service = NodeService(x_session_id)
    await service.delete_edge(model_id, edge_id)
    return {"message": "Edge deleted successfully"}
