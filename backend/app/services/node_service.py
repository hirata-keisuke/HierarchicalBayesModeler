import uuid
from typing import List
from fastapi import HTTPException
from app.models.schemas import (
    NodeCreate,
    NodeUpdate,
    NodeResponse,
    EdgeCreate,
    EdgeResponse,
)
from app.utils.redis_client import redis_client

class NodeService:
    def __init__(self, session_id: str):
        self.session_id = session_id

    def _get_nodes_key(self, model_id: str) -> str:
        return f"sessions:{self.session_id}:models:{model_id}:nodes"

    def _get_edges_key(self, model_id: str) -> str:
        return f"sessions:{self.session_id}:models:{model_id}:edges"

    async def create_node(self, model_id: str, node_data: NodeCreate) -> NodeResponse:
        """ノードを作成"""
        node_id = f"node_{uuid.uuid4().hex[:8]}"

        node = {
            "node_id": node_id,
            "node_type": node_data.node_type,
            "gui_name": node_data.gui_name,
            "code_name": node_data.code_name,
            "shape": node_data.shape,
            "distribution": node_data.distribution,
            "parameters": node_data.parameters or {},
            "operation": node_data.operation,
            "position": node_data.position,
        }

        # Redisに保存
        nodes_key = self._get_nodes_key(model_id)
        redis_client.hset_json(nodes_key, node_id, node)
        redis_client.expire(nodes_key, 86400)  # 24時間

        return NodeResponse(**node)

    async def get_all_nodes(self, model_id: str) -> List[NodeResponse]:
        """モデルの全ノードを取得"""
        nodes_key = self._get_nodes_key(model_id)
        nodes_data = redis_client.hgetall_json(nodes_key)

        return [NodeResponse(**node) for node in nodes_data.values()]

    async def update_node(
        self, model_id: str, node_id: str, node_data: NodeUpdate
    ) -> NodeResponse:
        """ノードを更新"""
        nodes_key = self._get_nodes_key(model_id)
        existing_node = redis_client.hget_json(nodes_key, node_id)

        if not existing_node:
            raise HTTPException(status_code=404, detail="Node not found")

        # 更新
        update_dict = node_data.model_dump(exclude_unset=True)
        existing_node.update(update_dict)

        # Redisに保存
        redis_client.hset_json(nodes_key, node_id, existing_node)
        redis_client.expire(nodes_key, 86400)

        return NodeResponse(**existing_node)

    async def delete_node(self, model_id: str, node_id: str):
        """ノードを削除"""
        nodes_key = self._get_nodes_key(model_id)
        redis_client.hdel(nodes_key, node_id)

        # このノードに接続されているエッジも削除
        edges_key = self._get_edges_key(model_id)
        all_edges = redis_client.hgetall_json(edges_key)

        for edge_id, edge in all_edges.items():
            if edge["source"] == node_id or edge["target"] == node_id:
                redis_client.hdel(edges_key, edge_id)

    async def create_edge(self, model_id: str, edge_data: EdgeCreate) -> EdgeResponse:
        """エッジを作成"""
        edge_id = f"edge_{uuid.uuid4().hex[:8]}"

        edge = {
            "edge_id": edge_id,
            "source": edge_data.source,
            "target": edge_data.target,
            "source_handle": edge_data.source_handle,
            "target_handle": edge_data.target_handle,
        }

        # Redisに保存
        edges_key = self._get_edges_key(model_id)
        redis_client.hset_json(edges_key, edge_id, edge)
        redis_client.expire(edges_key, 86400)

        return EdgeResponse(**edge)

    async def get_all_edges(self, model_id: str) -> List[EdgeResponse]:
        """モデルの全エッジを取得"""
        edges_key = self._get_edges_key(model_id)
        edges_data = redis_client.hgetall_json(edges_key)

        return [EdgeResponse(**edge) for edge in edges_data.values()]

    async def delete_edge(self, model_id: str, edge_id: str):
        """エッジを削除"""
        edges_key = self._get_edges_key(model_id)
        redis_client.hdel(edges_key, edge_id)
