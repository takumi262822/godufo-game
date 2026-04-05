/**
 * @author Takumi Harada
 * @date 2026/3/31
 */
import { Player } from "./game-player.js";
import { EnemyManager } from "../managers/enemy-manager.js";
import { ProjectileManager } from "../managers/projectile-manager.js";
import { UIManager } from "../managers/ui-manager.js";
import { InputManager } from "../managers/input-manager.js";
import { SpecialManager } from "../managers/special-manager.js";
import { CollisionManager } from "../managers/collision-manager.js";
import { RenderManager } from "../managers/render-manager.js";
import { StateManager } from "../managers/state-manager.js";
import { ENEMY_TYPES } from "../data/enemy-data.js";
import { GAME_CONFIG, INPUT_KEYS } from "../utils/constants.js";
import { Footer } from "../ui/footer.js";

// ゲーム全体の進行を束ねるメインクラス
// Manager が多いけど、それぞれ役割を分けることでここがごちゃつかないようにしている
export class Game {
  constructor() {
    this.canvas = document.getElementById("gameCanvas");
    this.ctx = this.canvas.getContext("2d");
    this.canvas.width = GAME_CONFIG.CANVAS_WIDTH;
    this.canvas.height = GAME_CONFIG.CANVAS_HEIGHT;

    // ゲーム進行フラグ
    this.isStarted = this.isGameOver = false;

    // スコア・フレームカウンタ・シェイク量（シェイクは毎フレーム 0.92 倍で減衰する）
    this.score = this.frame = this.shake = 0;

    // シールドは 100 スタート。0 になるとゲームオーバー
    this.shield = 100;
    this.wave = 1;

    // timeScale は 1.0 が通常。ウェーブクリア時や必殺技発動時にスローになる
    this.timeScale = 1;

    // 必殺技エネルギー（敵を倒すたびに上昇し 100 で使用可能になる）
    this.specialEnergy = 0;

    // 溜め撃ちゲージ。クリック長押しで 100 まで上昇し、リリース時に弾種が変わる
    this.chargeLevel = 0;
    this.isCharging = false;

    // powerLevel: 1〜5 で一度に出る弾の本数が変わる
    this.powerLevel = 1;

    // アイテム効果フラグ（ホーミング弾・バリア）
    this.hasHoming = false;
    this.barrierHealth = 0;

    this.KEYS = INPUT_KEYS;

    // 自機は画面下側中央あたりに初期配置
    this.player = new Player(300, 650);

    // Manager を一括初期化。引数で game インスタンス自体を渡してデータ共有している
    this.enemyManager = new EnemyManager(ENEMY_TYPES);
    this.projectileManager = new ProjectileManager();
    this.uiManager = new UIManager(
      document.getElementById("score"),
      document.getElementById("level"),
      document.getElementById("shield-fill"),
      document.getElementById("special-btn")
    );
    this.specialManager = new SpecialManager(this);
    this.collisionManager = new CollisionManager(this);
    this.renderManager = new RenderManager(this);
    this.stateManager = new StateManager(this);
    this.inputManager = new InputManager(this);
    this.inputManager.init();
  }

  // 必殺技は InputManager 経由で呼ばれる（スペース・Xキー・タッチボタン）
  triggerSpecial() {
    if (this.isStarted && !this.isGameOver) this.specialManager.triggerSpecial();
  }

  // 発射: 溜め状態をリセットして ProjectileManager に投げるだけ
  fire() {
    if (!this.isStarted || this.isGameOver) return;
    this.projectileManager.spawnPlayerFire(
      this.player,
      this.powerLevel,
      this.chargeLevel >= 100, // 100 以上なら溜め撃ち（貫通白弾）
      this.hasHoming
    );
    this.isCharging = false;
    this.chargeLevel = 0;
  }

  // スコアに応じて自機の見た目を変える（色・ズーム・光輪数）
  // 閾値は 3000 と 10000。GOD モードになると派手さが一段上がる
  getUfoStyle() {
    if (this.score >= 10000) return { c: "#f0f", z: 1.4, k: 4 };
    if (this.score >= 3000)  return { c: "#fff", z: 1.2, k: 2 };
    return { c: "#0ff", z: 1.0, k: 1 };
  }

  // 毎フレーム処理。開始前・ゲームオーバー後はスキップする
  update() {
    if (!this.isStarted || this.isGameOver) return;

    this.frame++;
    this.player.update();

    // シェイクは毎フレーム 8% ずつ自然に収まる
    if (this.shake > 0) this.shake *= 0.92;

    // 必殺技エネルギーは時間経過でも少しずつ溜まる（1 フレームあたり 0.06）
    this.specialEnergy = Math.min(100, this.specialEnergy + 0.06);

    // クリックを押しっぱなしにしている間だけチャージが進む
    if (this.isCharging) this.chargeLevel = Math.min(this.chargeLevel + 2.5, 100);

    // 敵の移動・射撃を更新。返ってくるのは今フレームに撃たれた敵弾の配列
    const eb = this.enemyManager.update(this.frame, this.timeScale, this.canvas.width);
    this.projectileManager.enemyBullets.push(...eb);

    this.projectileManager.updateBullets(this.canvas, this.enemyManager.enemies);
    this.collisionManager.resolve();
    this.stateManager.updateLevel();

    // UIManager は更新と同時にゲームオーバー判定も兼ねている（シールド 0 で true を返す）
    if (this.uiManager.update(this.score, this.wave, this.shield, this.specialEnergy, this.isGameOver)) {
      this.isGameOver = true;
    }
  }

  draw() { this.renderManager.drawScene(); }

  // requestAnimationFrame で自分自身を再帰呼び出しするメインループ
  gameLoop() {
    this.update();
    this.draw();
    requestAnimationFrame(() => this.gameLoop());
  }
}

new Game().gameLoop();
new Footer().setYear();
