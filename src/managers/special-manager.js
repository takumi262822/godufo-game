/**
 * SpecialManager クラス
 * @author Takumi Harada
 * @date 2026-03-31
 */
/**
 * SpecialManager クラス
 * 目的: 機能領域ごとの処理を管理する
 * 入力: ゲーム状態・イベント・対象オブジェクト
 * 処理: 責務領域の更新・判定・連携を行う
 * 出力: 領域ごとの処理結果
 * 補足: 単一責務を維持し必要最小限で連携する
 * @author Takumi Harada
 * @date 2026-04-01
 */
export class SpecialManager {
  constructor(game) {
    this.game = game;
  }

  triggerSpecial() {
    const g = this.game;
    
    // エネルギーぁE00に満たなぁE��合�E中断
    if (g.specialEnergy < 100 || g.isGameOver || !g.isStarted) {
      return;
    }

    // 発勁E
    g.specialEnergy = 0;
    g.shake = 100;      // 画面を激しく揺らす
    g.timeScale = 0.1;  // スロー演�E

    g.enemyManager.enemies.forEach((e) => {
      if (!e.alive) return;
      // 最初�E設定値通り40ダメージ
      e.hp -= 40; 
      if (e.hp <= 0) {
        e.alive = false;
        g.score += e.isBoss ? 3000 : (e.score || 150);
        // 倒した時に5回復する設定を維持E
        g.specialEnergy = Math.min(100, g.specialEnergy + 5);
      }
    });

    // UIの更新を即座に反映
    g.uiManager.update(g.score, g.wave, g.shield, g.specialEnergy, g.isGameOver);
  }
}
