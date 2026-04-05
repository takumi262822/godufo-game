/**
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

    // wave%3 のタイミングでボスを出す。3の倍数にしたのは難易度リズムのため
    if (this.wave % 3 === 0) {
      const hp = 40 + this.wave * 15; // ウェーブが進むほど硬くなる
      this.enemies.push({
        x: 150, y: 100, w: 300, h: 80, hue: (this.wave * 60) % 360,
        alive: true, hp: hp, maxHp: hp, isBoss: true,
        vX: 1.0 + this.wave * 0.1, vY: 0, angle: 0, score: 3000
      });
    } else {
      // 上限 35 体で固定。それ以上増やすと Canvas 描画コストが目立ち始めた
      const count = Math.min(6 + this.wave * 2, 35);
      for (let i = 0; i < count; i++) {
        // ウェーブが上がるほど後半の敵種が選ばれやすくなる（配列前半から順に解禁）
        const availableTypes = Math.min(this.wave, this.enemyTypes.length);
        const typeDef = this.enemyTypes[Math.floor(Math.random() * availableTypes)];
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
        // ボスは横移動だけ。端に当たると折り返す
        e.x += e.vX * timeScale;
        if (e.x < 20 || e.x > canvasWidth - e.w - 20) e.vX *= -1;
        // 20フレームごとに3発バラ撃ち（ランダム角度で）
        if (frame % 20 === 0) {
          enemyBullets.push({ x: e.x + Math.random() * e.w, y: e.y + e.h, vX: (Math.random() - 0.5) * 6, vY: 5 });
        }
      } else {
        // agility はウェーブごとに少しずつ上がり、後半はかなり機敏に動く
        const agility = (e.agility || 0.02) + this.wave * 0.002;
        e.angle += (Math.random() - 0.5) * agility;

        // 速度の上限は limit で制御。超えたらクランプする
        const limit = 0.8 + this.wave * 0.1;
        e.vX += Math.cos(e.angle) * 0.05;
        e.vY += Math.sin(e.angle) * 0.05;
        e.vX = Math.max(-limit, Math.min(limit, e.vX));
        e.vY = Math.max(-limit, Math.min(limit, e.vY));
        e.x += e.vX * timeScale;
        e.y += e.vY * timeScale;

        // 壁バウンスは angle も反転する（単純な vX 反転だけだと引っかかる）
        if (e.x < 0 || e.x > canvasWidth - e.w) { e.vX *= -1; e.angle = Math.PI - e.angle; }
        if (e.y < 0 || e.y > 450)               { e.vY *= -1; e.angle = -e.angle; }

        // shootRate は敵種ごとに設定。未定義なら 0.007（約7フレームに1回）
        if (Math.random() < (e.shootRate || 0.007)) {
          enemyBullets.push({ x: e.x + e.w / 2, y: e.y + e.h, vX: 0, vY: 4 });
        }
      }
    });

    return enemyBullets;
  }

  // length > 0 のガードはゲーム開始直後の誤クリアを防ぐためにある
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
        // 120度ずつ回転した矩形を3枚重ねる。frame でゆっくり自転
        ctx.rotate(frame * 0.02);
        for (let i = 0; i < 3; i++) {
          ctx.rotate(Math.PI / 1.5);
          ctx.strokeRect(-e.w / 2, -e.h / 2, e.w, e.h);
        }
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(0, 0, 15, 0, Math.PI * 2);
        ctx.fill();

        // HPバー（全体幅 e.w に対してHPの割合を乗算）
        ctx.restore();
        ctx.save();
        ctx.fillStyle = "#f00";
        ctx.fillRect(e.x, e.y - 15, (e.hp / e.maxHp) * e.w, 8);
      } else {
        // 形状ごとに頂点を計算して描画
        const w = e.w / 2;
        const h = e.h / 2;
        ctx.beginPath();
        if      (e.shape === "TRIANGLE") { ctx.moveTo(0, -h); ctx.lineTo(w, h); ctx.lineTo(-w, h); }
        else if (e.shape === "OCTAGON")  { for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; ctx.lineTo(Math.cos(a) * w, Math.sin(a) * h); } }
        else if (e.shape === "HEXAGON")  { for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3; ctx.lineTo(Math.cos(a) * w, Math.sin(a) * h); } }
        else if (e.shape === "DIAMOND")  { ctx.moveTo(0, -h); ctx.lineTo(w, 0); ctx.lineTo(0, h); ctx.lineTo(-w, 0); }
        ctx.closePath();
        ctx.stroke();
      }

      ctx.restore();
    });
  }
}
