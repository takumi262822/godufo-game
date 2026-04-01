/**
 * InputManager クラス
 * @author Takumi Harada
 * @date 2026-03-31
 */
/**
 * InputManager クラス
 * 目的: 機能領域ごとの処理を管理する
 * 入力: ゲーム状態・イベント・対象オブジェクト
 * 処理: 責務領域の更新・判定・連携を行う
 * 出力: 領域ごとの処理結果
 * 補足: 単一責務を維持し必要最小限で連携する
 * @author Takumi Harada
 * @date 2026-04-01
 */
/**
 * 処理概要:
 * - 初期化処理: ボタン、マウス、タッチ、キーボードのイベントを登録する
 * - 入力変換: 画面座標を Canvas 座標へ変換し、自機移動へ結び付ける
 * - 出力処理: Game 本体へ操作結果を渡して状態更新を発火する
 */
export class InputManager {
  constructor(game) { this.game = game; }

  init() {
    const g = this.game;
    const startBtn = document.getElementById("start-btn");
    const specialBtn = document.getElementById("special-btn");

    // 座標計算（ズレ防止�E�E
    const getX = (e) => {
      const r = g.canvas.getBoundingClientRect();
      const cx = e.touches ? e.touches[0].clientX : e.clientX;
      return (cx - r.left) * (g.canvas.width / r.width);
    };

    // ミッション開姁E
    if (startBtn) {
      startBtn.addEventListener("click", (e) => {
        e.preventDefault();
        document.getElementById("title-screen").classList.add("hidden");
        g.isStarted = true;
        g.enemyManager.spawnWave();
      });
    }

    // 忁E��技ボタン�E�タチE�E・クリチE��両対応！E
    if (specialBtn) {
      const trigger = (e) => {
        e.preventDefault(); e.stopPropagation();
        if (g.isStarted) g.triggerSpecial();
      };
      specialBtn.addEventListener("touchstart", trigger, { passive: false });
      specialBtn.addEventListener("mousedown", trigger);
    }

    // 移動�Eチャージ・発封E�E統吁E
    const down = (e) => {
      if (!g.isStarted) return;
      g.isCharging = true;
      g.player.moveTo(getX(e));
    };
    const move = (e) => {
      if (g.isStarted) {
        g.player.moveTo(getX(e));
        if (e.touches) e.preventDefault(); // スクロール防止
      }
    };
    const up = () => {
      if (g.isStarted) g.fire();
    };

    // マウスイベンチE
    window.addEventListener("mousedown", down);
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);

    // タチE��イベント（スマ�E�E�E
    window.addEventListener("touchstart", (e) => { down(e); }, { passive: false });
    window.addEventListener("touchmove", (e) => { move(e); }, { passive: false });
    window.addEventListener("touchend", (e) => { up(e); }, { passive: false });

    // キーボ�EチE
    window.addEventListener("keydown", (e) => {
      if (g.KEYS.SPECIAL.includes(e.code)) g.triggerSpecial();
    });
  }
}
