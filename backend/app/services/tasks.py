from app.celery_app import celery_app

@celery_app.task(bind=True)
def build_model_task(self, model_id: str, session_id: str):
    """PyMCモデルを構築するタスク"""
    # TODO: 実装
    pass

@celery_app.task(bind=True)
def sample_task(self, model_id: str, session_id: str, config: dict):
    """サンプリングを実行するタスク"""
    # TODO: 実装
    pass
