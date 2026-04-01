/**
 * Footer クラス
 * @author Takumi Harada
 * @date 2026-03-31
 */
/**
 * Footer クラス
 * 目的: UI部品の生成・更新を担当する
 * 入力: 表示データ・DOM要素・操作イベント
 * 処理: 画面要素を生成/更新し必要なイベントを接続する
 * 出力: 更新されたUI表示
 * 補足: ビジネスロジックは別クラスに分離する
 * @author Takumi Harada
 * @date 2026-04-01
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
