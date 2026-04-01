/**
 * CollisionManager クラス
 * @author Takumi Harada
 * @date 2026-03-31
 */
/**
 * CollisionManager クラス
 * 目的: 機能領域ごとの処理を管理する
 * 入力: ゲーム状態・イベント・対象オブジェクト
 * 処理: 責務領域の更新・判定・連携を行う
 * 出力: 領域ごとの処理結果
 * 補足: 単一責務を維持し必要最小限で連携する
 * @author Takumi Harada
 * @date 2026-04-01
 */
/**
 * 処理概要:
 * - 入力値: 自機、敵、弾、アイテム、バリア状態など現在フレームの状態
 * - 判定処理: 弾と敵、自機と敵弾、自機とアイテムの衝突を順番に評価する
 * - 出力処理: HP、スコア、演出フラグ、配列要素の削除結果を反映する
 */
export class CollisionManager {
  constructor(game) { this.game = game; }

  resolve() {
    const g = this.game;
    const style = g.getUfoStyle();
    
    // 敵弾 vs プレイヤー
    for (let i = g.projectileManager.enemyBullets.length - 1; i >= 0; i--) {
      const eb = g.projectileManager.enemyBullets[i];
      if (Math.hypot(eb.x - g.player.x, eb.y - g.player.y) < 26 * style.z) {
        g.projectileManager.enemyBullets.splice(i, 1);
        if (g.barrierHealth > 0) {
          g.barrierHealth = Math.max(0, g.barrierHealth - 25);
          g.shake = 5;
        } else {
          g.shield = Math.max(0, g.shield - 20);
          g.shake = 45;
        }
      }
    }

    // アイチE��取征E
    for (let i = g.projectileManager.items.length - 1; i >= 0; i--) {
      const it = g.projectileManager.items[i];
      if (Math.hypot(it.x - g.player.x, it.y - g.player.y) < 45) {
        if (it.type === "heal") g.shield = Math.min(100, g.shield + 20);
        if (it.type === "power") g.powerLevel = Math.min(5, g.powerLevel + 1);
        if (it.type === "homing") g.hasHoming = true;
        if (it.type === "barrier") g.barrierHealth = 100;
        g.projectileManager.items.splice(i, 1);
      }
    }

    // 自弾 vs 敵
    for (let i = g.projectileManager.bullets.length - 1; i >= 0; i--) {
      const b = g.projectileManager.bullets[i];
      let hit = false;
      for (const e of g.enemyManager.enemies) {
        if (!e.alive) continue;
        if (b.x > e.x && b.x < e.x + e.w && b.y > e.y && b.y < e.y + e.h) {
          e.hp -= 1;
          hit = true;
          if (e.hp <= 0) {
            e.alive = false;
            g.score += e.isBoss ? 3000 : (e.score || 150);
            g.specialEnergy = Math.min(100, g.specialEnergy + 8);
            if (Math.random() < 0.3) g.projectileManager.spawnItem(e.x + e.w/2, e.y + e.h/2);
          }
          if (!b.pierce) break;
        }
      }
      if (hit && !b.pierce) g.projectileManager.bullets.splice(i, 1);
    }
  }
}
