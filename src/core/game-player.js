/**
 * @author Takumi Harada
 * @date 2026/3/31
 */
export class Player {
  constructor(x = 300, y = 650) {
    this.x = x;
    this.y = y;
    this.w = 50;
    this.h = 30;
    // targetX は「目標地点」。x を直接変えず targetX だけ動かして追従させる
    this.targetX = x;
  }

  update() {
    // 0.18 という係数は「ふわっと追いつく感じ」が出る絶妙な値
    // 0.1 だとのろすぎ、0.3 だとガタついてゲームにならなかった
    this.x += (this.targetX - this.x) * 0.18;
  }

  moveTo(screenX) {
    this.targetX = screenX;
  }

  getHitbox() {
    return { x: this.x - this.w / 2, y: this.y - this.h / 2, w: this.w, h: this.h };
  }
}
