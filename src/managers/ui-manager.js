/**
 * UIManager クラス
 * @author Takumi Harada
 * @date 2026-03-31
 */
/**
 * UIManager クラス
 * 目的: UI部品の生成・更新を担当する
 * 入力: 表示データ・DOM要素・操作イベント
 * 処理: 画面要素を生成/更新し必要なイベントを接続する
 * 出力: 更新されたUI表示
 * 補足: ビジネスロジックは別クラスに分離する
 * @author Takumi Harada
 * @date 2026-04-01
 */
export class UIManager {
  constructor(scoreEl, levelEl, shieldFill, specialBtn) {
    this.scoreEl = scoreEl;
    this.levelEl = levelEl;
    this.shieldFill = shieldFill;
    this.specialBtn = specialBtn;
  }

  update(score, wave, shield, specialEnergy, isGameOver) {
    if (this.scoreEl) this.scoreEl.textContent = String(score).padStart(5, "0");
    if (this.levelEl) this.levelEl.textContent = String(wave).padStart(2, "0");
    if (this.shieldFill) {
      this.shieldFill.style.width = Math.max(0, shield) + "%";
      this.shieldFill.style.background = shield > 60 ? "#0ff" : shield > 20 ? "#ff0" : "#f00";
    }

    if (this.specialBtn) {
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

    if (shield <= 0 && !isGameOver) {
      return true;
    }
    return false;
  }
}
