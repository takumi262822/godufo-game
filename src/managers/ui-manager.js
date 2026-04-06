/**
 * スコア・ウェーブ・シールドバー・特殊ゲージなど HUD 要素を毎フレーム更新するクラス。
 * @author Takumi Harada
 * @date 2026/3/31
 */
export class UIManager {
  constructor(scoreEl, levelEl, shieldFill, specialBtn) {
    this.scoreEl = scoreEl;
    this.levelEl = levelEl;
    this.shieldFill = shieldFill;
    this.specialBtn = specialBtn;
  }

  update(score, wave, shield, specialEnergy, isGameOver) {
    // DOM要素が存在する場合のみスコアを更新する
    if (this.scoreEl) this.scoreEl.textContent = String(score).padStart(5, "0");
    // DOM要素が存在する場合のみウェーブ番号を更新する
    if (this.levelEl) this.levelEl.textContent = String(wave).padStart(2, "0");
    // DOM要素が存在する場合のみシールドバーの幅と色を更新する
    if (this.shieldFill) {
      this.shieldFill.style.width = Math.max(0, shield) + "%";
      this.shieldFill.style.background = shield > 60 ? "#0ff" : shield > 20 ? "#ff0" : "#f00";
    }

    // 必殺技ボタンの DOM 要素が存在する場合のみ表示制御を行う
    if (this.specialBtn) {
      // エネルギーが満タンになった場合に必殺技ボタンを表示する
      if (specialEnergy >= 100) {
        this.specialBtn.classList.remove("hidden");
        this.specialBtn.style.opacity = "1";
        this.specialBtn.style.pointerEvents = "auto";
      } else {
        this.specialBtn.classList.add("hidden");
        this.specialBtn.style.opacity = "0";
        this.specialBtn.style.pointerEvents = "none";
      }
    }

    // シールドが0になりかつまだゲームオーバーになっていない場合のみゲームオーバー検知としてtrueを返す
    if (shield <= 0 && !isGameOver) {
      return true;
    }
    return false;
  }
}
