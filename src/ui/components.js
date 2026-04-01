/**
 * BaseComponent クラス
 * @author Takumi Harada
 * @date 2026-03-31
 */
/**
 * BaseComponent クラス
 * 目的: UI部品の生成・更新を担当する
 * 入力: 表示データ・DOM要素・操作イベント
 * 処理: 画面要素を生成/更新し必要なイベントを接続する
 * 出力: 更新されたUI表示
 * 補足: ビジネスロジックは別クラスに分離する
 * @author Takumi Harada
 * @date 2026-04-01
 */
/**
 * 処理概要:
 * - 初期化処理: 基本となる DOM 要素を生成し、クラス名を付与する
 * - 更新処理: 文字列、HTML、属性、子要素など UI 構築操作を提供する
 * - 出力処理: 再利用可能な共通 UI 部品として要素を返す
 */
export class BaseComponent {
  constructor(elementType = "div", className = "") {
    this.el = document.createElement(elementType);
    if (className) this.el.className = className;
  }

  setText(text) {
    this.el.textContent = text;
    return this;
  }

  setHTML(html) {
    this.el.innerHTML = html;
    return this;
  }

  on(event, handler) {
    this.el.addEventListener(event, handler);
    return this;
  }

  attach(parent = document.body) {
    parent.appendChild(this.el);
    return this;
  }
}

// Backward compatibility alias.
export { BaseComponent as UIComponent };
