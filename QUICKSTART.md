# クイックスタートガイド

## 🚀 アプリケーションの起動

### 1. Docker Composeで起動

```bash
# プロジェクトルートで実行
docker-compose up --build
```

初回起動時はビルドに数分かかります。以下のメッセージが表示されたら準備完了です：

```
api_1       | INFO:     Application startup complete.
frontend_1  | ➜  Local:   http://localhost:3000/
worker_1    | [2025-12-03 15:00:00,000: INFO/MainProcess] celery@xxx ready.
```

### 2. アクセス

- **フロントエンド**: http://localhost:3000
- **API ドキュメント**: http://localhost:8000/docs
- **API ヘルスチェック**: http://localhost:8000/health

### 3. 停止

```bash
docker-compose down
```

データを含めて完全に削除する場合：

```bash
docker-compose down -v
```

---

## 📋 現在実装済みの機能

### フロントエンド
- ✅ ReactFlowによるグラフィカルモデル構築
- ✅ 4種類のノード（観測変数、潜在変数、ハイパーパラメータ、演算ノード）
- ✅ ノードの追加・削除・編集
- ✅ エッジの接続
- ✅ Zustandによる状態管理
- ✅ ノード設定エディタ

### バックエンド
- ✅ FastAPI RESTful API
- ✅ ノード・エッジのCRUD操作
- ✅ Redisへのデータ永続化
- ✅ セッション管理（24時間有効）
- ✅ 10種類の基本分布定義
- ✅ 10種類の演算定義
- ✅ Celery Workerのセットアップ

---

## 🧪 動作確認

### 1. APIの動作確認

http://localhost:8000/docs にアクセスして、以下のエンドポイントをテスト：

#### ヘルスチェック
```bash
curl http://localhost:8000/health
```

#### 分布一覧を取得
```bash
curl http://localhost:8000/api/distributions
```

#### 演算一覧を取得
```bash
curl http://localhost:8000/api/operations
```

### 2. フロントエンドの動作確認

1. http://localhost:3000 にアクセス
2. サイドバーから「観測変数」をクリックしてノードを追加
3. 追加されたノードをクリックして設定を編集
4. 複数のノードを追加してエッジで接続

---

## 🔧 トラブルシューティング

### ポートが既に使用されている

```bash
# 使用中のポートを確認
lsof -i :3000
lsof -i :8000
lsof -i :6379

# プロセスを終了
kill -9 <PID>
```

### Dockerイメージのリビルド

```bash
docker-compose build --no-cache
docker-compose up
```

### ログの確認

```bash
# 全サービスのログ
docker-compose logs -f

# 特定のサービスのログ
docker-compose logs -f api
docker-compose logs -f frontend
docker-compose logs -f worker
```

### Redisのデータをクリア

```bash
docker-compose exec redis redis-cli FLUSHALL
```

---

## 📝 次に実装予定の機能

### Phase 1: 基本機能の完成
- [ ] PyMCモデル生成機能
- [ ] モデルの整合性チェック
- [ ] CSVデータのアップロード
- [ ] NUTSサンプリング実行
- [ ] 結果の可視化（トレースプロット、パラメータ推定値）

### Phase 2: 高度な機能
- [ ] プレート記法のサポート
- [ ] VI (Variational Inference) サポート
- [ ] 事前分布・事後予測機能
- [ ] 詳細な収束診断表示

### Phase 3: ユーザビリティ向上
- [ ] 分布の動的追加機能
- [ ] モデルのエクスポート・インポート
- [ ] モデルテンプレート機能
- [ ] パフォーマンス最適化

---

## 💡 使い方のヒント

### ノードの種類

| ノード | 用途 | 例 |
|--------|------|-----|
| 観測変数 | データから観測される変数 | 売上データ、クリック数 |
| 潜在変数 | 推定したい隠れた変数 | 個人の購買傾向、コンバージョン率 |
| ハイパーパラメータ | 事前分布のパラメータ | 平均の事前分布、分散の事前分布 |
| 演算ノード | 変数間の演算 | 線形回帰の予測値 = X @ beta |

### モデル構築の基本フロー

1. **ハイパーパラメータ**を追加（事前分布のパラメータ）
2. **潜在変数**を追加（推定したいパラメータ）
3. ハイパーパラメータ → 潜在変数 にエッジを接続
4. 必要に応じて**演算ノード**を追加
5. **観測変数**を追加（データに対応）
6. 潜在変数 → 観測変数 にエッジを接続

### ベイズ線形回帰の例

```
[ハイパーパラメータ] mu_beta = 0
        ↓
[潜在変数] beta ~ Normal(mu_beta, 10)
        ↓
[演算ノード] y_pred = X @ beta
        ↓
[観測変数] y ~ Normal(y_pred, sigma)
```

---

## 📚 参考ドキュメント

- [要件定義書](docs/20251203_1430_階層ベイズモデルGUI要件定義.md)
- [演算と分布の定義スキーマ](docs/20251203_1445_演算と分布の定義スキーマ設計.md)
- [システムアーキテクチャ設計](docs/20251203_1500_システムアーキテクチャ設計.md)
- [PyMC公式ドキュメント](https://www.pymc.io/)
- [ReactFlow公式ドキュメント](https://reactflow.dev/)
