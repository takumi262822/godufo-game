# 設計書: GODUFO Portfolio

## 1. 文書概要

### 1.1 目的
本書は GODUFO Portfolio の実装設計書である。画面構成や見せ方の説明は SCREEN-OVERVIEW.md に分離し、本書では JavaScript 実装を対象に、クラス単位・メソッド単位・主要分岐単位で処理内容を整理する。

### 1.2 対象範囲
- ゲーム初期化とメインループ
- プレイヤー移動、弾生成、敵生成、当たり判定
- HUD 更新、ゲームオーバー判定、必殺技処理
- 敵定義、入力キー定義、描画演出

### 1.3 対象外
- サーバーサイド処理
- ランキング保存
- ネットワーク対戦
- ビルドツール導入

## 2. システム構成

### 2.1 モジュール構成
| 区分 | ファイル | 役割 |
|---|---|---|
| エントリー | src/core/game-core.js | Game を生成し gameLoop を開始する |
| プレイヤー | src/core/game-player.js | 自機座標、追従先座標、当たり判定用サイズを保持する |
| 敵管理 | src/managers/enemy-manager.js | ウェーブ生成、敵移動、敵弾生成を担当する |
| 弾管理 | src/managers/projectile-manager.js | 自機弾、敵弾、ドロップアイテムの生成と更新を担当する |
| 入力 | src/managers/input-manager.js | マウス、タッチ、キーボード入力をゲーム操作へ変換する |
| 判定 | src/managers/collision-manager.js | プレイヤー、敵、弾、アイテムの衝突判定を処理する |
| 描画 | src/managers/render-manager.js | 背景、自機、敵、弾、演出を描画する |
| 状態 | src/managers/state-manager.js | ウェーブ遷移、スロー演出、ゲームオーバー判定を処理する |
| UI | src/managers/ui-manager.js | SCORE、WAVE、SHIELD、SPECIAL の表示を更新する |
| 必殺技 | src/managers/special-manager.js | 必殺技発動条件と効果反映を処理する |
| 定数 | src/utils/constants.js | 画面サイズ、キー定義、各種設定値を管理する |
| データ | src/data/enemy-data.js | 敵種別と行動特性を定義する |

### 2.2 起動シーケンス
1. index.html から src/core/game-core.js を読み込む。
2. Game constructor が Canvas と各 Manager を初期化する。
3. InputManager.init() が開始ボタン、移動、発射、必殺技の入力を登録する。
4. new Game().gameLoop() が requestAnimationFrame ベースで更新と描画を繰り返す。
5. 開始ボタン押下後に EnemyManager.spawnWave() が実行され、プレイ状態へ移行する。

## 3. データ設計

### 3.1 ゲーム状態
| 項目 | 型 | 内容 |
|---|---|---|
| isStarted | boolean | 開始前かプレイ中かを管理する |
| isGameOver | boolean | 終了状態を管理する |
| score | number | 現在スコア |
| frame | number | フレーム進行値 |
| shake | number | 画面揺れ演出の強度 |
| shield | number | プレイヤー耐久値 |
| wave | number | 現在ウェーブ |
| timeScale | number | ウェーブ遷移時の演出速度係数 |
| specialEnergy | number | 必殺技ゲージ |
| chargeLevel | number | 溜め撃ちゲージ |
| isCharging | boolean | 溜め入力中か |
| powerLevel | number | 通常弾の同時発射数 |
| hasHoming | boolean | ホーミング弾解放状態 |
| barrierHealth | number | バリア耐久値 |

### 3.2 定数・データ定義

定数の具体値は `docs/定数定義書.adoc`、識別子の種別値は `docs/コード定義書.adoc` を参照すること。

## 4. 設計方針

### 4.1 1 クラス 1 責務

Game はゲームループのみ。Player は座標保持のみ。各 Manager は自身の領域（敵・弾・衝突・描画・状態・UI・必殺技・入力）の管理のみを担う。クラス間の依存はコンストラクタ引数を通じて注入し、グローバル変数を使用しない。

### 4.2 requestAnimationFrame ループ

`gameLoop()` が毎フレーム `update()` → `draw()` の順で実行される。timeScale を変更することでスロー演出をコード変更なしに実現し、ゲームスピードの調整を柔軟に行える。

### 4.3 データ主導の敵設計

敵の行動特性を `ENEMY_TYPES` オブジェクト（enemy-data.js）に集約し、EnemyManager はデータを解釈して動作する。新敵種の追加はオブジェクトへのプロパティ追加のみで完結する。

### 4.4 XSS 対策

Canvas API を通じた描画のみを行い、ユーザー入力を DOM に反映する箇所では textContent を使用する。入力検証は Validator クラスに集約する。

## 5. 関連ドキュメント

| ドキュメント | 内容 |
|---|---|
| README.md | プロジェクト概要・実行手順 |
| SCREEN-OVERVIEW.md | 画面構成・遷移・UI 説明 |
| docs/機能設計書.adoc | クラス・メソッド・分岐単位の詳細仕様 |
| docs/コード定義書.adoc | 識別子・種別コードの定義 |
| docs/定数定義書.adoc | 定数値・設定値一覧 |
