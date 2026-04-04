/**
 * マウス・タッチ・キーボード入力を受け取り、自機移動・発射・特殊攻撃に変換するクラス。
 * @author Takumi Harada
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
