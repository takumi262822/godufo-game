/**
 * 弾・自機・アイテム間の衝突判定を担うクラス。
 * ヒット時のダメージ処理・アイテム効果適用・スコア加算を一括で行う。
 * @author Takumi Harada
 * @date 2026/3/31
 */
export class CollisionManager {
  constructor(game) { this.game = game; }

  resolve() {
    const g = this.game;
    const style = g.getUfoStyle();

    // --- 敵弾 vs 自機 ---
    // 逆ループで splice するのはインデックスずれを防ぐため（前から消すと次の要素が飛ぶ）
    for (let i = g.projectileManager.enemyBullets.length - 1; i >= 0; i--) {
      const eb = g.projectileManager.enemyBullets[i];
      // 当たり判定はピクセル距離のみ。ズームが大きいほど自機が「大きく」当たる
      if (Math.hypot(eb.x - g.player.x, eb.y - g.player.y) < 26 * style.z) {
        g.projectileManager.enemyBullets.splice(i, 1);
        if (g.barrierHealth > 0) {
          // バリアがあれば先にそっちを削る（シールドより優先）
          g.barrierHealth = Math.max(0, g.barrierHealth - 25);
          g.shake = 5;  // バリアヒットは小さめの揺れ
        } else {
          g.shield = Math.max(0, g.shield - 20);
          g.shake = 45; // 直撃は大きい揺れ
        }
      }
    }

    // --- アイテム取得 ---
    // 45px 以内に近づけば自動回収（引き付けは実装していない）
    for (let i = g.projectileManager.items.length - 1; i >= 0; i--) {
      const it = g.projectileManager.items[i];
      if (Math.hypot(it.x - g.player.x, it.y - g.player.y) < 45) {
        if (it.type === "heal")    g.shield       = Math.min(100, g.shield + 20);
        if (it.type === "power")   g.powerLevel   = Math.min(5, g.powerLevel + 1);
        if (it.type === "homing")  g.hasHoming    = true;
        if (it.type === "barrier") g.barrierHealth = 100;
        g.projectileManager.items.splice(i, 1);
      }
    }

    // --- 自弾 vs 敵 ---
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
            if (e.isBoss) g.shake = 60;
            g.specialEnergy = Math.min(100, g.specialEnergy + 8);
            // 30% の確率でアイテムをドロップ
            if (Math.random() < 0.3) g.projectileManager.spawnItem(e.x + e.w / 2, e.y + e.h / 2);
          }
          // pierce（貫通）属性の弾は命中後も消えずに奥の敵へ進む
          if (!b.pierce) break;
        }
      }
      if (hit && !b.pierce) g.projectileManager.bullets.splice(i, 1);
    }
  }
}
