/**
 * Player クラス
 * @author Takumi Harada
 * @date 2026-03-31
 */
/**
 * Player クラス
 * 目的: アプリ/ゲームの進行制御を担当する
 * 入力: 初期データ・現在状態・ユーザー操作
 * 処理: 初期化・分岐・状態更新を実行する
 * 出力: 進行更新された画面状態
 * 補足: 各下位クラスの責務を束ねる
 * @author Takumi Harada
 * @date 2026-04-01
 */
/**
 * 処理概要:
 * - 初期化処理: 自機の座標、サイズ、追従先座標を設定する
 * - 更新処理: targetX に向かって滑らかに移動し、入力結果を反映する
 * - 出力処理: 描画と当たり判定で利用する位置情報を提供する
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
