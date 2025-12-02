import redis
import json
from typing import Optional, Any
from app.config import settings

class RedisClient:
    def __init__(self):
        self.client = redis.from_url(settings.REDIS_URL, decode_responses=True)

    def set_json(self, key: str, value: Any, ex: Optional[int] = None) -> bool:
        """JSON形式でデータを保存"""
        try:
            json_str = json.dumps(value, ensure_ascii=False)
            return self.client.set(key, json_str, ex=ex)
        except Exception as e:
            print(f"Redis set_json error: {e}")
            return False

    def get_json(self, key: str) -> Optional[Any]:
        """JSON形式でデータを取得"""
        try:
            value = self.client.get(key)
            if value is None:
                return None
            return json.loads(value)
        except Exception as e:
            print(f"Redis get_json error: {e}")
            return None

    def delete(self, key: str) -> int:
        """キーを削除"""
        return self.client.delete(key)

    def hset_json(self, name: str, key: str, value: Any) -> int:
        """Hashにjson形式でデータを保存"""
        try:
            json_str = json.dumps(value, ensure_ascii=False)
            return self.client.hset(name, key, json_str)
        except Exception as e:
            print(f"Redis hset_json error: {e}")
            return 0

    def hget_json(self, name: str, key: str) -> Optional[Any]:
        """Hashからjson形式でデータを取得"""
        try:
            value = self.client.hget(name, key)
            if value is None:
                return None
            return json.loads(value)
        except Exception as e:
            print(f"Redis hget_json error: {e}")
            return None

    def hgetall_json(self, name: str) -> dict:
        """Hash内の全データをjson形式で取得"""
        try:
            raw_data = self.client.hgetall(name)
            return {k: json.loads(v) for k, v in raw_data.items()}
        except Exception as e:
            print(f"Redis hgetall_json error: {e}")
            return {}

    def hdel(self, name: str, *keys: str) -> int:
        """Hashから指定キーを削除"""
        return self.client.hdel(name, *keys)

    def exists(self, key: str) -> bool:
        """キーが存在するか確認"""
        return self.client.exists(key) > 0

    def expire(self, key: str, seconds: int) -> bool:
        """キーに有効期限を設定"""
        return self.client.expire(key, seconds)

redis_client = RedisClient()
