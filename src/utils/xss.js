/**
 * XssSanitizer クラス
 * @author Takumi Harada
 * @date 2026-03-31
 */
/**
 * XssSanitizer クラス
 * 目的: XSS対策を担当し表示データを安全化する
 * 入力: ユーザー入力値・表示対象文字列
 * 処理: 危険文字のエスケープや正規化を行う
 * 出力: 安全化された文字列
 * 補足: DOM反映前に本クラスを経由する
 * @author Takumi Harada
 * @date 2026-04-01
 */
export class XssSanitizer {
  static escapeHtml(value) {
    const str = value == null ? "" : String(value);
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  static sanitizeTextInput(value) {
    return this.escapeHtml(value);
  }
}

// Backward compatibility alias.
export { XssSanitizer as XSSSanitizer };
