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

### 3.2 定数定義

#### GAME_CONFIG (src/utils/constants.js)
| 定数 | 値 | 用途 |
|---|---|---|
| CANVAS_WIDTH | 600 | Canvas 横幅 (px) |
| CANVAS_HEIGHT | 750 | Canvas 縦幅 (px) |
| START_SHIELD | 100 | 初期シールド値 |
| MAX_POWER_LEVEL | 5 | 最大火力レベル |
| SPECIAL_ENERGY_MAX | 100 | 必殺技ゲージ満タン値 |

- INPUT_KEYS.SPECIAL: `["KeyX", "Space"]`
- UI_TEXT.TITLE: `"UFO GOD: OVERDRIVE"`
- UI_TEXT.COPYRIGHT: `"© 2026 UFO GOD CORP."`

#### ENEMY_TYPES (src/data/enemy-data.js)
| 名前 | shape | hue | hp | speedMult | agility | shootRate | score | size (w×h) |
|---|---|---|---|---|---|---|---|---|
| STINGER | TRIANGLE | 190 | 1 | 1.6 | 0.05 | 0.004 | 150 | 25×25 |
| OCTA-CORE | OCTAGON | 280 | 2 | 1.0 | 0.02 | 0.007 | 300 | 30×30 |
| CRUISER | HEXAGON | 0 | 5 | 0.7 | 0.01 | 0.012 | 600 | 45×25 |
| VOID-EYE | DIAMOND | 120 | 1 | 1.3 | 0.04 | 0.005 | 200 | 20×35 |

#### ボス生成条件
- `wave % 3 === 0` のとき通常敵を生成せずボス 1 体を生成する。
- ボスは `isBoss: true`、`hp: wave * 4`、`score: 1000 * wave` で生成される。

## 4. 詳細設計

### 4.1 Game クラス

#### 4.1.1 constructor
- I/F:
  - 入力: DOM 上の gameCanvas、score、level、shield-fill、special-btn
  - 出力: 初期化済み Game インスタンス
- 設定値:
  - Canvas サイズ: GAME_CONFIG.CANVAS_WIDTH / CANVAS_HEIGHT
  - 初期シールド: 100
  - 初期ウェーブ: 1
- 処理:
  1. Canvas と 2D context を取得し描画サイズを設定する。
  2. 開始状態、スコア、ウェーブ、各種ゲージを初期化する。
  3. Player と各 Manager を生成する。
  4. InputManager.init() を呼び、操作受付を開始する。

#### 4.1.2 triggerSpecial
- I/F:
  - 入力: isStarted、isGameOver、specialEnergy
  - 出力: SpecialManager.triggerSpecial() 実行有無
- 処理:
  1. プレイ中かつ非ゲームオーバー時のみ必殺技処理へ委譲する。
- 分岐:
  - a. 開始前またはゲームオーバー時: 何もせず終了する。

#### 4.1.3 fire
- I/F:
  - 入力: プレイヤー位置、powerLevel、chargeLevel、hasHoming
  - 出力: ProjectileManager.bullets 更新
- 処理:
  1. 未開始またはゲームオーバー時は終了する。
  2. spawnPlayerFire() で自機弾を生成する。
  3. 溜め状態とチャージ量を初期化する。
- 分岐:
  - a. 開始前または終了後: 発射しない。
  - b. chargeLevel が 100 以上: 溜め撃ち用の大弾を生成する。

#### 4.1.4 getUfoStyle
- I/F:
  - 入力: score
  - 出力: 色、拡大率、回転リング数
- 処理:
  1. スコア帯に応じて UFO の発光色と描画サイズを返す。
- 分岐:
  - a. score が 10000 以上: 最終強化表現を返す。
  - b. score が 3000 以上: 中間強化表現を返す。
  - c. それ以外: 初期表現を返す。

#### 4.1.5 update
- I/F:
  - 入力: 現在フレーム、ゲーム状態
  - 出力: 1 フレーム分更新後の状態
- 処理:
  1. 開始前またはゲームオーバー時なら終了する。
  2. フレーム加算、自機更新、画面揺れ減衰を行う。
  3. 必殺技ゲージと溜めゲージを更新する。
  4. EnemyManager.update() で敵移動と敵弾生成を行う。
  5. ProjectileManager.updateBullets() で弾とアイテムを更新する。
  6. CollisionManager.resolve() で衝突判定を行う。
  7. StateManager.updateLevel() でウェーブ進行を更新する。
  8. UIManager.update() で HUD を反映する。
- 分岐:
  - a. isCharging が true: chargeLevel を 100 上限で加算する。
  - b. UIManager.update() が true を返した場合: isGameOver を true にする。

#### 4.1.6 draw
- 役割: RenderManager.drawScene() を呼び、現在状態を Canvas に反映する。

#### 4.1.7 gameLoop
- I/F:
  - 入力: なし
  - 出力: requestAnimationFrame による継続更新
- 処理:
  1. update() を実行する。
  2. draw() を実行する。
  3. 次フレームの gameLoop() を予約する。

### 4.2 Player クラス

#### 4.2.1 constructor
- 役割: 自機座標、サイズ、追従先座標を初期化する。

#### 4.2.2 update
- 役割: targetX に向かって補間移動し、急激な入力変化を滑らかにする。

#### 4.2.3 moveTo
- 役割: 入力座標を目標位置として保持する。

#### 4.2.4 getHitbox
- 役割: 当たり判定用の矩形情報を返す。

### 4.3 InputManager クラス

#### 4.3.1 init
- I/F:
  - 入力: start-btn、special-btn、window のマウス、タッチ、キーイベント
  - 出力: Game への移動、発射、必殺技トリガー
- 処理:
  1. 開始ボタン押下でタイトルを閉じ、プレイ状態へ切り替える。
  2. 画面座標を Canvas 座標へ変換する getX() を定義する。
  3. 押下中はチャージ状態にし、移動先を Player へ反映する。
  4. 離した時点で fire() を呼び出す。
  5. special-btn とキーボード入力から triggerSpecial() を呼び出す。
- 分岐:
  - a. 未開始時の移動・発射入力は無視する。
  - b. タッチ操作時は preventDefault() を実行してスクロールを抑止する。
  - c. special-btn が存在しない場合: 画面ボタン入力だけ登録しない。

### 4.4 EnemyManager クラス

#### 4.4.1 spawnWave
- I/F:
  - 入力: wave、enemyTypes
  - 出力: enemies 配列の再生成
- 処理:
  1. 現在の敵配列を空にする。
  2. wave が 3 の倍数ならボス敵を 1 体生成する。
  3. それ以外は wave に応じた通常敵数を決めて生成する。
- 分岐:
  - a. wave % 3 === 0: ボス用パラメータで敵を 1 体投入する。
  - b. それ以外: enemyTypes から抽選し複数生成する。

#### 4.4.2 update
- I/F:
  - 入力: frame、timeScale、canvasWidth
  - 出力: 新規生成された enemyBullets 配列
- 処理:
  1. 生存敵のみ走査する。
  2. ボスは左右移動と一定間隔射撃を行う。
  3. 通常敵は角度と速度を揺らしながら移動する。
  4. 画面端や高さ制限に当たった場合は進行方向を反転する。
  5. 発射条件を満たした敵の弾を返却配列へ積む。
- 分岐:
  - a. isBoss: 横移動と frame % 20 ごとの拡散弾を使う。
  - b. 通常敵: agility と shootRate に応じた移動と発射を行う。
  - c. 画面端に達した場合: vX または vY を反転する。

#### 4.4.3 areAllDead
- 役割: 敵配列が空でなく、全敵が alive false かを判定する。

#### 4.4.4 draw
- 役割: 敵種別に応じた形状とボス HP バーを描画する。

### 4.5 ProjectileManager クラス

#### 4.5.1 constructor
- 役割: 自機弾、敵弾、ドロップアイテム配列を初期化する。

#### 4.5.2 spawnPlayerFire
- I/F:
  - 入力: player、powerLevel、burst、homing
  - 出力: bullets 配列への追加
- 処理:
  1. 溜め撃ちか通常弾かで弾サイズと色を切り替える。
  2. powerLevel 分だけ横にずらした自機弾を生成する。
  3. homing 有効時は通常弾にのみ追尾属性を付与する。
- 分岐:
  - a. burst が true: 貫通属性付きの大型弾を生成する。
  - b. burst が false: 通常弾を生成する。

#### 4.5.3 updateBullets
- I/F:
  - 入力: canvas、enemies
  - 出力: bullets、enemyBullets、items の位置更新
- 処理:
  1. 自機弾を逆順走査して位置更新する。
  2. ホーミング弾は生存敵から最短距離の敵へ向きを補正する。
  3. 画面外へ出た自機弾を削除する。
  4. 敵弾とアイテムを下方向へ移動する。
- 分岐:
  - a. homing が true かつ生存敵がある場合: 目標追尾を行う。
  - b. 画面外に出た場合: 配列から削除する。

#### 4.5.4 spawnItem
- 役割: 回復、火力、ホーミング、バリアのいずれかを抽選しドロップ生成する。

#### 4.5.5 draw
- 役割: ドロップアイテム、自機弾、敵弾を色分けして描画する。

### 4.6 CollisionManager クラス

#### 4.6.1 resolve
- I/F:
  - 入力: プレイヤー、敵、自機弾、敵弾、アイテム、バリア状態
  - 出力: score、shield、specialEnergy、各配列の更新
- 処理:
  1. 敵弾とプレイヤーの距離判定を行う。
  2. アイテム取得判定を行い、効果を状態へ反映する。
  3. 自機弾と敵の矩形判定を行う。
  4. 撃破時はスコア加算、必殺技ゲージ回復、アイテム抽選を行う。
- 分岐:
  - a. barrierHealth が残っている場合: シールドではなくバリアを消費し、shake = 5 を設定する。
  - a-else. バリアがない場合: シールドを 20 消費し、shake = 45 を設定する。
  - b. アイテム種別が heal/power/homing/barrier のどれかで効果を分ける。
  - c. bullet が pierce false の場合: 命中後に弾を削除する。
  - d. 敵 HP が 0 以下になった場合: alive を false にし撃破報酬を反映する。isBoss が true の場合は shake = 60 を設定する。

### 4.7 StateManager クラス

#### 4.7.1 updateLevel
- I/F:
  - 入力: enemyManager.enemies、shield、isGameOver
  - 出力: wave、timeScale、isGameOver 更新
- 処理:
  1. 敵が存在し、かつ全滅している場合のみ次ウェーブへ進める。
  2. wave を加算し、EnemyManager.wave と同期する。
  3. spawnWave() で新ウェーブを生成する。
  4. 演出として timeScale を一時的に下げる。
  5. timeScale を徐々に 1.0 に戻す。
  6. shield が 0 以下であればゲームオーバーにし、一定時間後に再読込する。
- 分岐:
  - a. enemies.length が 0 の場合: 開始直後誤判定を避けるためウェーブ遷移しない。
  - b. timeScale < 1 の場合: 毎フレーム少しずつ回復する。
  - c. shield <= 0 かつ未終了の場合: reload 予約を行う。

### 4.8 UIManager クラス

#### 4.8.1 update
- I/F:
  - 入力: score、wave、shield、specialEnergy、isGameOver
  - 出力: HUD DOM 更新、終了判定結果
- 処理:
  1. スコアとウェーブをゼロ埋め表示する。
  2. シールド幅と色を現在値に応じて更新する。
  3. 必殺技ゲージが満タンならボタンを表示する。
  4. シールド 0 以下かつ未終了なら true を返す。
- 分岐:
  - a. shield > 60 / > 20 / それ以下でゲージ色を変える。
  - b. specialEnergy >= 100 の場合のみ special-btn を操作可能にする。

### 4.9 SpecialManager クラス

#### 4.9.1 triggerSpecial
- I/F:
  - 入力: specialEnergy、isStarted、isGameOver、enemyManager.enemies
  - 出力: 敵一掃後の score、specialEnergy、shake、timeScale 更新
- 処理:
  1. 必殺技発動条件を確認する。
  2. ゲージを 0 にし、揺れとスロー演出を適用する。
  3. 生存敵へ固定ダメージを与える。
  4. 撃破時はスコア加算とゲージ回復を行う。
  5. UIManager.update() を呼び即時反映する。
- 分岐:
  - a. specialEnergy < 100、未開始、ゲームオーバー時: 発動しない。
  - b. 敵 HP が 0 以下になった場合: 撃破扱いにする。

### 4.10 RenderManager クラス

#### 4.10.1 drawScene
- I/F:
  - 入力: Canvas、Context、shake、敵、自機、弾
  - 出力: 1 フレーム分の描画結果
- 処理:
  1. 半透明背景で残像を作る。
  2. shake 値に応じて描画原点をランダムにずらす。
  3. プレイ中のみ drawPlayer() を呼ぶ。
  4. EnemyManager.draw() と ProjectileManager.draw() を呼ぶ。

#### 4.10.2 drawPlayer
- 役割: バリア、チャージエフェクト、リング、本体発光を重ねて自機を描画する。

## 5. 非機能要件
- 実行環境: Chrome / Edge 最新版、ローカルサーバー経由
- 品質ゲート: npm run lint、npm test、GitHub Actions CI
- 制約: localStorage やバックエンド連携は持たない単体プレイ構成

## 7. DOM セレクター一覧

### 7.1 Game コンストラクターが取得する DOM
| id | 役割 |
|---|---|
| `gameCanvas` | 描画用 Canvas 要素（width=600, height=750） |
| `score` | 現在スコアのテキスト表示要素 |
| `level` | 現在ウェーブのテキスト表示要素 |
| `shield-fill` | シールドゲージのバー要素 |
| `special-btn` | 必殺技ボタン（ゲージ満タン時のみ表示） |

### 7.2 InputManager が登録するイベント要素
| id / セレクター | イベント | 処理 |
|---|---|---|
| `start-btn` | `click` | タイトルを閉じてプレイ状態へ移行 |
| `special-btn` | `click` | `triggerSpecial()` を呼び出す |
| `window` | `mousemove` | 自機追従と isCharging を更新 |
| `window` | `mousedown` | チャージ開始 |
| `window` | `mouseup` | `fire()` を呼び出す |
| `window` | `touchstart / touchmove / touchend` | タッチ操作をマウス操作へ変換 |
| `window` | `keydown` | `INPUT_KEYS.SPECIAL` で `triggerSpecial()` |

### 7.3 UFO スタイル閾値
| スコア | 色 | 拡大率 | リング数 |
|---|---|---|---|
| 0 〜 2999 | `#0ff` | 1.0 | 1 |
| 3000 〜 9999 | `#fff` | 1.2 | 2 |
| 10000 以上 | `#f0f` | 1.4 | 4 |

## 6. 入力検証 / セキュリティ実装詳細

### 6.1 FormValidator クラス

#### 6.1.1 isRequired
- 処理: `value != null && value.toString().trim() !== ""`
- 用途: スコア入力などの必須チェック

#### 6.1.2 isInt
- 処理: `Number.isInteger(Number(value))`
- 用途: 整数値を期待するフィールドの型確認

#### 6.1.3 inRange
- 処理: `!Number.isNaN(n) && n >= min && n <= max`
- 用途: スコア上限（0〜9999999）などの範囲チェック

#### 6.1.4 validateScore
- 処理: `isInt(score) && inRange(score, 0, 9999999)`
- 用途: ゲームスコア値の最終バリデーション

### 6.2 XSSProtection クラス

#### 6.2.1 sanitize
- I/F:
  - 入力: value
  - 出力: HTML エスケープ済み文字列
- 変換テーブル:
  - `&` → `&amp;`
  - `<` → `&lt;`
  - `>` → `&gt;`
  - `"` → `&quot;`
  - `'` → `&#x27;`
- 実装パターン:
  - `/[&<>"']/g` をマッチし、対応するエンティティへ map 引きする
- 分岐:
  - a. value が string でない場合: 変換せずそのまま返す
