/**
 * XssSanitizer クラス
 * @author Takumi Harada
 * @date 2026-03-31
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
