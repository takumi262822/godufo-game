/**
 * Canvas へのゲーム画面描画を担うクラス。背景・自機・敵・弾・シェイク演出を毎フレーム合成する。
 * @author Takumi Harada
 * @date 2026/3/31
 */
export class RenderManager {
  constructor(game) { this.game = game; }
  drawScene() {
    const g = this.game; const ctx = g.ctx;
    ctx.fillStyle = "rgba(0, 8, 18, 0.4)"; ctx.fillRect(0, 0, g.canvas.width, g.canvas.height);
    ctx.save();
    ctx.translate((Math.random()-0.5)*g.shake, (Math.random()-0.5)*g.shake);
    if (!g.isGameOver && g.isStarted) this.drawPlayer();
    g.enemyManager.draw(ctx, g.frame);
    g.projectileManager.draw(ctx);
    ctx.restore();
  }

  drawPlayer() {
    const g = this.game; const ctx = g.ctx; const s = g.getUfoStyle();
    ctx.save(); ctx.translate(g.player.x, g.player.y); ctx.scale(s.z, s.z);

    if (g.barrierHealth > 0) {
      ctx.beginPath(); ctx.arc(0, 0, 42, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(0, 255, 255, ${g.barrierHealth / 100})`;
      ctx.lineWidth = 3; ctx.stroke();
    }

    if (g.isCharging) {
      ctx.beginPath(); ctx.arc(0, 0, g.chargeLevel / 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${g.chargeLevel / 200})`; ctx.fill();
    }

    ctx.shadowBlur = 18; ctx.shadowColor = s.c;
    for (let i = 0; i < s.k + 2; i++) {
      ctx.save(); ctx.rotate(g.frame * 0.06 + (i * Math.PI * 2) / (s.k + 2));
      ctx.strokeStyle = s.c; ctx.beginPath(); ctx.arc(0, 0, 24, 0, Math.PI / 1.5); ctx.stroke(); ctx.restore();
    }
    ctx.fillStyle = "#111"; ctx.beginPath(); ctx.ellipse(0, 0, 22, 11, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(0, 0, 5 + Math.sin(g.frame * 0.1) * 2, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
}
