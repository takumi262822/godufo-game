/**
 * ゲーム画面上部のヘッダー要素を生成し、タイトル表示を管理する UI クラス。
 * @author Takumi Harada
 * @date 2026/3/31
 */
export class Header {
  constructor(root = document.body, title = "") {
    this.root = root;
    this.title = title;
    this.el = document.createElement("header");
    this.el.className = "game-header";
    this.titleEl = document.createElement("h1");
    this.titleEl.textContent = title;
    this.el.appendChild(this.titleEl);
  }

  setTitle(title) {
    this.title = title;
    this.titleEl.textContent = title;
    return this;
  }

  attach() {
    this.root.prepend(this.el);
    return this;
  }
}
