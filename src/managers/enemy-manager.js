/**
 * 敵ウェーブの生成・移動・射撃を管理するクラス。
 * ウェーブ番号に応じて敵数・速度・射撃頻度を段階的に上昇させる。
 * @author Takumi Harada
 * @date 2026/3/31
 */
export class EnemyManager {
  constructor(enemyTypes) {
    this.enemyTypes = enemyTypes || [];
    this.enemies = [];
    this.wave = 1;
  }

  spawnWave() {
    this.enemies = [];
    if (this.wave % 3 === 0) {
      // 最初�E設定通りのボスパラメータ
      const hp = 40 + this.wave * 15;
      this.enemies.push({
        x: 150, y: 100, w: 300, h: 80, hue: (this.wave * 60) % 360,
        alive: true, hp: hp, maxHp: hp, isBoss: true,
        vX: 1.0 + this.wave * 0.1, vY: 0, angle: 0, score: 3000
      });
    } else {
      const count = Math.min(6 + this.wave * 2, 35);
      for (let i = 0; i < count; i++) {
        const availableTypes = Math.min(this.wave, this.enemyTypes.length);
        const typeDef = this.enemyTypes[Math.floor(Math.random() * availableTypes)];
        // typeDef.createEnemy 冁E��設定されたサイズをそのまま使用
        const e = typeDef.createEnemy(
          Math.random() * (600 - 40),
          Math.random() * 250 + 50,
          0.3 + this.wave * 0.1
        );
        this.enemies.push(e);
      }
    }
  }

  update(frame, timeScale, canvasWidth) {
    const enemyBullets = [];
    this.enemies.forEach((e) => {
      if (!e.alive) return;
      if (e.isBoss) {
        e.x += e.vX * timeScale;
        if (e.x < 20 || e.x > canvasWidth - e.w - 20) e.vX *= -1;
        if (frame % 20 === 0) {
          enemyBullets.push({ x: e.x + Math.random() * e.w, y: e.y + e.h, vX: (Math.random() - 0.5) * 6, vY: 5 });
        }
      } else {
        const agility = (e.agility || 0.02) + this.wave * 0.002;
        e.angle += (Math.random() - 0.5) * agility;
        const limit = 0.8 + this.wave * 0.1;
        e.vX += Math.cos(e.angle) * 0.05; e.vY += Math.sin(e.angle) * 0.05;
        e.vX = Math.max(-limit, Math.min(limit, e.vX)); e.vY = Math.max(-limit, Math.min(limit, e.vY));
        e.x += e.vX * timeScale; e.y += e.vY * timeScale;
        if (e.x < 0 || e.x > canvasWidth - e.w) { e.vX *= -1; e.angle = Math.PI - e.angle; }
        if (e.y < 0 || e.y > 450) { e.vY *= -1; e.angle = -e.angle; }
        if (Math.random() < (e.shootRate || 0.007)) {
          enemyBullets.push({ x: e.x + e.w / 2, y: e.y + e.h, vX: 0, vY: 4 });
        }
      }
    });
    return enemyBullets;
  }

  areAllDead() { return this.enemies.length > 0 && this.enemies.every(e => !e.alive); }

  draw(ctx, frame) {
    this.enemies.forEach((e) => {
      if (!e.alive) return;
      ctx.save();
      ctx.translate(e.x + e.w / 2, e.y + e.h / 2);
      ctx.shadowBlur = 15;
      ctx.shadowColor = `hsl(${e.hue}, 100%, 50%)`;
      ctx.strokeStyle = `hsl(${e.hue}, 100%, 70%)`;
      ctx.lineWidth = 2;

      if (e.isBoss) {
        // 【復允E���Eス特有�E120度回転3連矩形描画
        ctx.rotate(frame * 0.02);
        for (let i = 0; i < 3; i++) {
          ctx.rotate(Math.PI / 1.5);
          ctx.strokeRect(-e.w / 2, -e.h / 2, e.w, e.h);
        }
        ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(0, 0, 15, 0, Math.PI * 2); ctx.fill();
        // HPバ�Eの復允E
        ctx.restore(); ctx.save();
        ctx.fillStyle = "#f00";
        ctx.fillRect(e.x, e.y - 15, (e.hp / e.maxHp) * e.w, 8);
      } else {
        // 通常敵�E�個別のサイズと形状を復允E
        const w = e.w / 2; const h = e.h / 2;
        ctx.beginPath();
        if (e.shape === "TRIANGLE") { ctx.moveTo(0, -h); ctx.lineTo(w, h); ctx.lineTo(-w, h); }
        else if (e.shape === "OCTAGON") { for(let i=0; i<8; i++) { const a=i*Math.PI/4; ctx.lineTo(Math.cos(a)*w, Math.sin(a)*h); } }
        else if (e.shape === "HEXAGON") { for(let i=0; i<6; i++) { const a=i*Math.PI/3; ctx.lineTo(Math.cos(a)*w, Math.sin(a)*h); } }
        else if (e.shape === "DIAMOND") { ctx.moveTo(0, -h); ctx.lineTo(w, 0); ctx.lineTo(0, h); ctx.lineTo(-w, 0); }
        ctx.closePath(); ctx.stroke();
      }
      ctx.restore();
    });
  }
}
