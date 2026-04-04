/**
 * HTML 特殊文字を安全なエンティティに変換し、XSS を防ぐサニタイズクラス。DOM 反映前に必ず経由する。
 * @author Takumi Harada
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
