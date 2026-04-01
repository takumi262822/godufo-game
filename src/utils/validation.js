/**
 * FormValidator クラス
 * @author Takumi Harada
 * @date 2026-03-31
 */
/**
 * FormValidator クラス
 * 目的: このクラスの責務を実行する
 * 入力: 状態値・設定値・ユーザー操作
 * 処理: 責務に沿って判定/更新/制御を行う
 * 出力: 更新済みの状態または表示結果
 * 補足: 詳細は DESIGN.md のクラス設計を参照
 * @author Takumi Harada
 * @date 2026-04-01
 */
export class FormValidator {
  static isRequired(value) {
    return value != null && value.toString().trim() !== "";
  }

  static isInt(value) {
    return Number.isInteger(Number(value));
  }

  static inRange(value, min, max) {
    const n = Number(value);
    return !Number.isNaN(n) && n >= min && n <= max;
  }

  static validateScore(score) {
    return this.isInt(score) && this.inRange(score, 0, 9999999);
  }
}
