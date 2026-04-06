/**
 * @author Takumi Harada
 * @date 2026/3/31
 */
export class InputManager {
  constructor(game) { this.game = game; }

  init() {
    const g = this.game;
    const startBtn   = document.getElementById("start-btn");
    const specialBtn = document.getElementById("special-btn");

    // canvas の表示サイズと canvas.width が違うときにズレる問題を補正
    const getX = (e) => {
      const r  = g.canvas.getBoundingClientRect();
      const cx = e.touches ? e.touches[0].clientX : e.clientX;
      return (cx - r.left) * (g.canvas.width / r.width);
    };

    // タイトル画面を隠して最初のウェーブを生成
    if (startBtn) {
      startBtn.addEventListener("click", (e) => {
        e.preventDefault();
        document.getElementById("title-screen").classList.add("hidden");
        g.isStarted = true;
        g.enemyManager.spawnWave();
      });
    }

    // 必殺技ボタンはタッチとマウス両方に対応（モバイルは touchstart でないと遅延がある）
    if (specialBtn) {
      const trigger = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (g.isStarted) g.triggerSpecial();
      };
      specialBtn.addEventListener("touchstart", trigger, { passive: false });
      specialBtn.addEventListener("mousedown", trigger);
    }

    // 押した瞬間にチャージ開始 + 自機の targetX も更新
    const down = (e) => {
      // ゲームの入力は引数で、ゲームの開始前は指/クリック操作を無視する
      if (!g.isStarted) return;
      g.isCharging = true;
      g.player.moveTo(getX(e));
    };

    const move = (e) => {
      // ゲームの入力は引数で、ゲームの開始前は移動操作を無視する
      if (!g.isStarted) return;
      g.player.moveTo(getX(e));
      // touchmove はデフォルトでスクロールが走るので preventDefault で止める
      if (e.touches) e.preventDefault();
    };

    // 指/クリックを離したら発射（チャージ量によって弾種が変わる）
    const up = () => {
      if (g.isStarted) g.fire();
    };

    window.addEventListener("mousedown", down);
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup",   up);

    // passive: false にしないと touchmove 内で preventDefault が効かない
    window.addEventListener("touchstart", (e) => { down(e); }, { passive: false });
    window.addEventListener("touchmove",  (e) => { move(e); }, { passive: false });
    window.addEventListener("touchend",   (e) => { up(e);   }, { passive: false });

    // キーボードはスペースか X で必殺技
    window.addEventListener("keydown", (e) => {
      if (g.KEYS.SPECIAL.includes(e.code)) g.triggerSpecial();
    });
  }
}
