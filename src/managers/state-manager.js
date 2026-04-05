/**
 * @author Takumi Harada
 * @date 2026/3/31
 */
export class StateManager {
  constructor(game) {
    this.game = game;
  }

  updateLevel() {
    const g = this.game;

    // 「敵が1体以上いる && 全員死亡」という二重チェックが重要
    // length > 0 を省くと、ゲーム開始直後（enemies が空の瞬間）にも次ウェーブへ進んでしまう
    if (g.enemyManager.enemies.length > 0 && g.enemyManager.areAllDead()) {
      g.wave += 1;
      g.enemyManager.wave = g.wave;
      g.enemyManager.spawnWave();

      // ウェーブクリア時だけ一瞬スローにして達成感を演出
      g.timeScale = 0.2;
    }

    // スロー状態は毎フレーム +0.01 で自然に 1.0 へ戻る（0.8 秒ほどで復帰）
    if (g.timeScale < 1) {
      g.timeScale += 0.01;
    }

    // シールドが 0 になった瞬間だけここを通す（二重発火防止で isGameOver フラグで制御）
    if (g.shield <= 0 && !g.isGameOver) {
      g.isGameOver = true;
      // 2秒待ってから location.reload でリスタート。setTimeout は意図的
      setTimeout(() => location.reload(), 2000);
    }
  }
}
