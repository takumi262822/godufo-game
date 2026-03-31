/**
 * BaseComponent クラス
 * @author Takumi Harada
 * @date 2026-03-31
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
