/**
 * ゲーム画面下部のフッター要素を生成し、コピーライト等の表示を管理する UI クラス。
 * @author Takumi Harada
 * @date 2026/3/31
 */
export class Footer {
  constructor(root = document.body, text = "") {
    this.root = root;
    this.text = text;
    this.el = document.createElement("footer");
    this.el.className = "game-footer";
    this.textEl = document.createElement("p");
    this.textEl.textContent = text;
    this.el.appendChild(this.textEl);
  }

  setText(text) {
    this.text = text;
    this.textEl.textContent = text;
    return this;
  }

  setYear() {
    const year = new Date().getFullYear();
    this.textEl.textContent = `© ${year}`;
    return this;
  }

  attach() {
    this.root.appendChild(this.el);
    return this;
  }
}
