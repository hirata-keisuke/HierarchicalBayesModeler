import uuid
from datetime import datetime
from fastapi import HTTPException
from app.models.schemas import ModelCreate, ModelResponse
from app.utils.redis_client import redis_client

class ModelService:
    def __init__(self, session_id: str):
        self.session_id = session_id

    def _get_model_key(self, model_id: str) -> str:
        return f"sessions:{self.session_id}:models:{model_id}:meta"

    async def create_model(self, model_data: ModelCreate) -> ModelResponse:
        """新しいモデルを作成"""
        model_id = f"mdl_{uuid.uuid4().hex[:8]}"

        model = {
            "model_id": model_id,
            "name": model_data.name,
            "description": model_data.description,
            "created_at": datetime.now().isoformat(),
            "session_id": self.session_id,
        }

        # Redisに保存（24時間の有効期限）
        model_key = self._get_model_key(model_id)
        redis_client.set_json(model_key, model, ex=86400)

        return ModelResponse(**model)

    async def get_model(self, model_id: str) -> ModelResponse:
        """モデル情報を取得"""
        model_key = self._get_model_key(model_id)
        model_data = redis_client.get_json(model_key)

        if not model_data:
            raise HTTPException(status_code=404, detail="Model not found")

        return ModelResponse(**model_data)

    async def delete_model(self, model_id: str):
        """モデルを削除"""
        # メタデータ削除
        model_key = self._get_model_key(model_id)
        redis_client.delete(model_key)

        # ノード削除
        nodes_key = f"sessions:{self.session_id}:models:{model_id}:nodes"
        redis_client.delete(nodes_key)

        # エッジ削除
        edges_key = f"sessions:{self.session_id}:models:{model_id}:edges"
        redis_client.delete(edges_key)
