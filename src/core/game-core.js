/**
 * Game core logic class (main loop / state transition)
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

/**

 * ゲーム全体の進行を束ねるメインクラス。
 * Canvas・各Managerを初期化し、毎フレームの更新・描画ループを制御する。
 * @author Takumi Harada
 */
export class Game {
  constructor() {
    this.canvas = document.getElementById("gameCanvas");
    this.ctx = this.canvas.getContext("2d");
    this.canvas.width = GAME_CONFIG.CANVAS_WIDTH;
    this.canvas.height = GAME_CONFIG.CANVAS_HEIGHT;
    this.isStarted = this.isGameOver = false;
    this.score = this.frame = this.shake = 0;
    this.shield = 100; this.wave = 1; this.timeScale = 1;
    this.specialEnergy = 0; this.chargeLevel = 0; this.isCharging = false;
    this.powerLevel = 1; this.hasHoming = false; this.barrierHealth = 0;
    this.KEYS = INPUT_KEYS;

    this.player = new Player(300, 650);
    this.enemyManager = new EnemyManager(ENEMY_TYPES);
    this.projectileManager = new ProjectileManager();
    this.uiManager = new UIManager(document.getElementById("score"), document.getElementById("level"), document.getElementById("shield-fill"), document.getElementById("special-btn"));
    this.specialManager = new SpecialManager(this);
    this.collisionManager = new CollisionManager(this);
    this.renderManager = new RenderManager(this);
    this.stateManager = new StateManager(this);
    this.inputManager = new InputManager(this);
    this.inputManager.init();
  }
  triggerSpecial() { if (this.isStarted && !this.isGameOver) this.specialManager.triggerSpecial(); }
  fire() {
    if (!this.isStarted || this.isGameOver) return;
    this.projectileManager.spawnPlayerFire(this.player, this.powerLevel, this.chargeLevel >= 100, this.hasHoming);
    this.isCharging = false; this.chargeLevel = 0;
  }
  getUfoStyle() {
    if (this.score >= 10000) return { c: "#f0f", z: 1.4, k: 4 };
    if (this.score >= 3000) return { c: "#fff", z: 1.2, k: 2 };
    return { c: "#0ff", z: 1.0, k: 1 };
  }
  update() {
    if (!this.isStarted || this.isGameOver) return;
    this.frame++; this.player.update();
    if (this.shake > 0) this.shake *= 0.92;
    this.specialEnergy = Math.min(100, this.specialEnergy + 0.06);
    if (this.isCharging) this.chargeLevel = Math.min(this.chargeLevel + 2.5, 100);
    const eb = this.enemyManager.update(this.frame, this.timeScale, this.canvas.width);
    this.projectileManager.enemyBullets.push(...eb);
    this.projectileManager.updateBullets(this.canvas, this.enemyManager.enemies);
    this.collisionManager.resolve();
    this.stateManager.updateLevel();
    if (this.uiManager.update(this.score, this.wave, this.shield, this.specialEnergy, this.isGameOver)) this.isGameOver = true;
  }
  draw() { this.renderManager.drawScene(); }
  gameLoop() { this.update(); this.draw(); requestAnimationFrame(() => this.gameLoop()); }
}
new Game().gameLoop();
new Footer().setYear();
