/**
 * Footer クラス
 * @author Takumi Harada
 * @date 2026-03-31
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

  attach() {
    this.root.appendChild(this.el);
    return this;
  }
}
