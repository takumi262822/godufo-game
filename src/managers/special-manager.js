/**
 * @author Takumi Harada
 * @date 2026/3/31
 */
export class SpecialManager {
  constructor(game) {
    this.game = game;
  }

  triggerSpecial() {
    const g = this.game;

    // エネルギーが満タンでないと発動しない（100 未満は弾かれる）
    if (g.specialEnergy < 100 || g.isGameOver || !g.isStarted) return;

    g.specialEnergy = 0;
    g.shake = 100;      // shake=100 は演出として最大値。毎フレーム 0.92 倍で静まる
    g.timeScale = 0.1;  // スロー演出（0.1 倍速）で「爆発した感」を出す

    g.enemyManager.enemies.forEach((e) => {
      if (!e.alive) return;
      e.hp -= 40; // 全画面の敵に一律 40 ダメージ
      if (e.hp <= 0) {
        e.alive = false;
        g.score += e.isBoss ? 3000 : (e.score || 150);
        // 必殺時に倒した敵から少しだけエネルギーを回収（連鎖ボーナス）
        g.specialEnergy = Math.min(100, g.specialEnergy + 5);
      }
    });

    g.uiManager.update(g.score, g.wave, g.shield, g.specialEnergy, g.isGameOver);
  }
}
