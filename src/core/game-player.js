/**
 * Player クラス
 * @author Takumi Harada
 * @date 2026-03-31
 */
export class Player {
  constructor(x = 300, y = 650) {
    this.x = x;
    this.y = y;
    this.w = 50;
    this.h = 30;
    this.targetX = x;
  }
  update() {
    this.x += (this.targetX - this.x) * 0.18;
  }
  moveTo(screenX) {
    this.targetX = screenX;
  }
  getHitbox() {
    return { x: this.x - this.w / 2, y: this.y - this.h / 2, w: this.w, h: this.h };
  }
}
