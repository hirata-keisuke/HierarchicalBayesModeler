import json
from pathlib import Path
from typing import List
from app.models.schemas import OperationDefinition

class OperationService:
    def __init__(self):
        self.config_path = Path("/app/config/operations")

    def get_all_operations(self) -> List[OperationDefinition]:
        """全ての演算定義を取得"""
        operations = []

        # 標準演算を読み込み
        standard_file = self.config_path / "operations.json"
        if standard_file.exists():
            with open(standard_file, "r", encoding="utf-8") as f:
                data = json.load(f)
                operations.extend([OperationDefinition(**o) for o in data])

        # カスタム演算を読み込み
        custom_file = self.config_path / "custom_operations.json"
        if custom_file.exists():
            with open(custom_file, "r", encoding="utf-8") as f:
                data = json.load(f)
                operations.extend([OperationDefinition(**o) for o in data])

        return operations
