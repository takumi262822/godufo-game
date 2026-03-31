# 設計書: GODUFO Portfolio

## 1. 目的
- 開発目的: ブラウザ2Dシューティングを題材に、責務分離とゲーム状態管理の実装力を示す。
- 評価してほしい点: マネージャ分割、入力処理、描画・当たり判定・状態更新の独立性。

## 2. 画面構成・遷移
- 画面一覧:
  - タイトル画面 (`index.html`)
  - ゲームプレイ画面 (`index.html` 内)
- 遷移:
  - タイトル画面 -> プレイ開始
  - プレイ中 -> ゲームオーバー/クリア表示 -> リトライ

## 3. クラス設計
| クラス | 責務 | 主なメソッド | 依存 |
|---|---|---|---|
| GameCore | ゲーム全体の進行管理 | init, update, render, loop | 各Manager |
| InputManager | 入力受付と操作反映 | init | GameCore, Player |
| EnemyManager | 敵生成と更新 | spawnWave, update | ProjectileManager |
| CollisionManager | 当たり判定処理 | checkAll | EnemyManager, ProjectileManager |
| RenderManager | 画面描画 | renderAll | GameCore状態 |
| StateManager | スコア・進行状態管理 | updateState | GameCore |
| UIManager | HUD/UI更新 | updateHud, showResult | StateManager |

## 4. データ設計
- 定数: `src/utils/constants.js`
- データ定義: `src/data/enemy-data.js`, `src/data/code-definitions.js`
- 永続化: 基本なし（セッション中メモリ管理）

## 5. 非機能
- 命名規則: ファイルは kebab-case、クラスは PascalCase、変数/関数は camelCase。
- 品質ゲート: `npm run lint`, `npm test`, GitHub Actions CI。
- 対応環境: Chrome / Edge 最新版推奨。
- 既知制約: ビルドツールなし（素のES Modules構成）。

## 6. 今後改善
- E2Eテスト追加による回帰検出強化。
- 描画とロジックのフレーム同期最適化。

## 7. 提出チェックリスト
- [ ] 起動手順を第三者が再現できる
- [ ] lint/test が通る
- [ ] 入力・当たり判定・UI更新の責務分離を説明できる
- [ ] 既知制約を説明できる
