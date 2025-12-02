import json
from pathlib import Path
from typing import List
from app.models.schemas import DistributionDefinition

class DistributionService:
    def __init__(self):
        self.config_path = Path("/app/config/distributions")

    def get_all_distributions(self) -> List[DistributionDefinition]:
        """全ての分布定義を取得"""
        distributions = []

        # 標準分布を読み込み
        standard_file = self.config_path / "distributions.json"
        if standard_file.exists():
            with open(standard_file, "r", encoding="utf-8") as f:
                data = json.load(f)
                distributions.extend([DistributionDefinition(**d) for d in data])

        # カスタム分布を読み込み
        custom_file = self.config_path / "custom_distributions.json"
        if custom_file.exists():
            with open(custom_file, "r", encoding="utf-8") as f:
                data = json.load(f)
                distributions.extend([DistributionDefinition(**d) for d in data])

        return distributions
