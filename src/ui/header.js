/**
 * Header クラス
 * @author Takumi Harada
 * @date 2026-03-31
 */
/**
 * Header クラス
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
 * - 初期化処理: header 要素とタイトル要素を生成し、ルート要素を保持する
 * - 更新処理: setTitle で画面タイトルやゲーム名の表示を切り替える
 * - 出力処理: 共通ヘッダー要素を画面上部へ追加できる状態にする
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
