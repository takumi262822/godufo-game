/**
 * 自機弾・敵弾・ドロップアイテムの生成・移動・消去を一元管理するクラス。追尾弾ロジックも含む。
 * @author Takumi Harada
 */
export class ProjectileManager {
  constructor() { this.bullets = []; this.enemyBullets = []; this.items = []; }
  spawnPlayerFire(p, pwr, burst, homing) {
    const t = burst ? { w: 12, h: 35, color: "#fff", p: true } : { w: 4, h: 15, color: "#0ff", p: false };
    for (let i = 0; i < pwr; i++) {
      this.bullets.push({ x: p.x + (i - (pwr - 1) / 2) * 16, y: p.y - 15, vX: 0, vY: -15, w: t.w, h: t.h, color: t.color, pierce: t.p, homing: homing && !burst });
    }
  }
  updateBullets(canvas, enemies) {
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const b = this.bullets[i];
      if (b.homing && enemies.length > 0) {
        const targets = enemies.filter(e => e.alive);
        if (targets.length > 0) {
          let c = targets[0], minDist = Infinity;
          targets.forEach(e => { const d = Math.hypot(e.x - b.x, e.y - b.y); if (d < minDist) { minDist = d; c = e; } });
          const angle = Math.atan2(c.y + c.h / 2 - b.y, c.x + c.w / 2 - b.x);
          b.vX += Math.cos(angle) * 2.0; b.vY += Math.sin(angle) * 2.0;
          const mag = Math.hypot(b.vX, b.vY); b.vX = (b.vX / mag) * 15; b.vY = (b.vY / mag) * 15;
        }
      }
      b.x += b.vX; b.y += b.vY;
      if (b.y < -50 || b.y > 800 || b.x < -50 || b.x > 650) this.bullets.splice(i, 1);
    }
    this.enemyBullets.forEach(eb => { eb.y += 4.5; });
    this.items.forEach(it => { it.y += 2.2; });
  }
  spawnItem(x, y) {
    const ts = [
      { t: "heal", c: "#0f0", l: "+" },
      { t: "power", c: "#ff0", l: "P" },
      { t: "homing", c: "#f0f", l: "H" },
      { t: "barrier", c: "#0ff", l: "B" }
    ];
    const t = ts[Math.floor(Math.random() * ts.length)];
    this.items.push({ x, y, type: t.t, color: t.c, label: t.l });
  }
  draw(ctx) {
    this.items.forEach(it => { ctx.save(); ctx.shadowBlur = 10; ctx.shadowColor = it.color; ctx.fillStyle = it.color; ctx.beginPath(); ctx.arc(it.x, it.y, 11, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = "#000"; ctx.font = "bold 13px Arial"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(it.label, it.x, it.y); ctx.restore(); });
    this.bullets.forEach(b => { ctx.fillStyle = b.color; ctx.fillRect(b.x - b.w / 2, b.y, b.w, b.h); });
    this.enemyBullets.forEach(eb => { ctx.fillStyle = "#f06"; ctx.beginPath(); ctx.arc(eb.x, eb.y, 5, 0, Math.PI * 2); ctx.fill(); });
  }
}
