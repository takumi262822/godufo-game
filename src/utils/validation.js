/**
 * スコア値の型・整数・範囲チェックを行うバリデーションヘルパークラス。
 * @author Takumi Harada
 * @date 2026/3/31
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
