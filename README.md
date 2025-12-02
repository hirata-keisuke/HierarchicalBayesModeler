# 階層ベイズモデルGUI

グラフィカルモデルを視覚的に構築し、PyMCを使って階層ベイズモデルの推論を実行できるWebアプリケーション。

## 特徴

- 🎨 **グラフィカルモデル構築**: ドラッグ&ドロップで直感的にモデルを構築
- 🔧 **拡張可能**: ソースコードを変更せずに新しい分布・演算を追加可能
- 📊 **可視化**: ArviZによる収束診断と結果の可視化
- 🚀 **非同期処理**: Celeryによる長時間実行タスクの非同期処理
- 🐳 **Docker対応**: Docker Composeで簡単にセットアップ

## アーキテクチャ

```
フロントエンド (React + TypeScript + ReactFlow)
            ↓
      APIサーバー (FastAPI)
            ↓
    Celery Worker (PyMC推論)
            ↓
         Redis (タスクキュー & キャッシュ)
```

## 必要な環境

- Docker Desktop (推奨) または
- Python 3.11+
- Node.js 20+
- Redis 7+

## クイックスタート (Docker)

### 1. リポジトリのクローン

```bash
git clone <repository-url>
cd 階層ベイズモデル
```

### 2. 環境変数の設定

```bash
cp backend/.env.example backend/.env
```

### 3. Docker Composeで起動

```bash
docker-compose up --build
```

アプリケーションが起動したら、以下のURLにアクセス：

- **フロントエンド**: http://localhost:3000
- **API**: http://localhost:8000
- **API ドキュメント**: http://localhost:8000/docs

### 4. 停止

```bash
docker-compose down
```

## ローカル開発環境のセットアップ

### バックエンド

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Redisを起動 (別ターミナル)
redis-server

# FastAPIサーバーを起動
uvicorn app.main:app --reload

# Celery Workerを起動 (別ターミナル)
celery -A app.celery_app worker --loglevel=info
```

### フロントエンド

```bash
cd frontend
npm install
npm run dev
```

## プロジェクト構造

```
.
├── backend/                 # FastAPI バックエンド
│   ├── app/
│   │   ├── api/            # APIエンドポイント
│   │   ├── models/         # データモデル
│   │   ├── services/       # ビジネスロジック
│   │   └── utils/          # ユーティリティ
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/                # React フロントエンド
│   ├── src/
│   │   ├── components/     # Reactコンポーネント
│   │   ├── services/       # API通信
│   │   └── types/          # TypeScript型定義
│   ├── Dockerfile
│   └── package.json
├── config/                  # 分布・演算定義JSON
│   ├── distributions/
│   └── operations/
├── docs/                    # 設計ドキュメント
├── storage/                 # データ保存先
├── docker-compose.yml       # 開発環境
└── docker-compose.prod.yml  # 本番環境
```

## 使い方

### 1. モデル構築

1. サイドバーからノードを選択して追加
2. ノード種類を選択（観測変数、潜在変数、ハイパーパラメータ、演算ノード）
3. ノードをクリックして設定（変数名、形状、分布など）
4. エッジでノード間の依存関係を接続

### 2. データのアップロード

1. CSV形式でデータをアップロード
2. モデルの観測変数とCSV列を対応付け

### 3. 推論実行

1. 「モデル構築」ボタンでモデルの整合性をチェック
2. 「事前分布の予測」で事前分布をサンプリング
3. 「サンプル実行」でフィッティング (NUTS or VI)
4. 結果の可視化（トレースプロット、フォレストプロット、パラメータ推定値）

### 4. 事後予測

1. 「推論実行」ボタンで事後予測を実行
2. 事後予測分布を可視化

## カスタム分布・演算の追加

### 分布の追加

`config/distributions/custom_distributions.json` に新しい分布を追加：

```json
{
  "name": "MyCustomDist",
  "display_name": "カスタム分布",
  "parameters": [
    {
      "name": "param1",
      "display_name": "パラメータ1",
      "type": "real",
      "default": 0,
      "required": true
    }
  ],
  "pymc_class": "pm.MyCustomDist",
  "support": "real",
  "multivariate": false,
  "description": "カスタム分布の説明"
}
```

### 演算の追加

`config/operations/custom_operations.json` に新しい演算を追加：

```json
{
  "name": "my_operation",
  "display_name": "カスタム演算",
  "notation": "{A} op {B}",
  "pymc_function": "pm.math.my_function",
  "operands": 2,
  "operand_names": ["A", "B"],
  "broadcasting": true,
  "description": "カスタム演算の説明"
}
```

## 本番環境へのデプロイ

```bash
docker-compose -f docker-compose.prod.yml up --build -d
```

## トラブルシューティング

### Redisに接続できない

- Redisが起動しているか確認: `redis-cli ping` → `PONG` が返ってくるはず
- Docker環境の場合、コンテナ名が正しいか確認

### Celery Workerが起動しない

- 環境変数 `CELERY_BROKER_URL` が正しく設定されているか確認
- バックエンドのコードにシンタックスエラーがないか確認

### フロントエンドがAPIに接続できない

- APIサーバーが起動しているか確認: http://localhost:8000/health
- CORS設定を確認: `backend/.env` の `CORS_ORIGINS`

## ドキュメント

詳細な設計ドキュメントは `docs/` ディレクトリを参照：

- [要件定義書](docs/20251203_1430_階層ベイズモデルGUI要件定義.md)
- [演算と分布の定義スキーマ](docs/20251203_1445_演算と分布の定義スキーマ設計.md)
- [システムアーキテクチャ設計](docs/20251203_1500_システムアーキテクチャ設計.md)

## ライセンス

MIT License

## 貢献

プルリクエストを歓迎します。大きな変更の場合は、まずissueで議論してください。

## サポート

問題が発生した場合は、GitHubのissueを作成してください。
