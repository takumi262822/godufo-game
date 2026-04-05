/**
 * ウェーブ進行・ゲームオーバー判定を担うクラス。
 * 全敵撃破でウェーブを更新し、シールド枯渇でゲームオーバーへ遷移する。
 * @author Takumi Harada
 * @date 2026/3/31
 */
export class StateManager {
  constructor(game) {
    this.game = game;
  }

  updateLevel() {
    const g = this.game;

    // 修正ポイント：敵が「�E列に存在し」、かつ「�E員死んでぁE��」時のみ次へ進む
    // これにより、E��始直後や生�E中の「敵ぁE匹」�E瞬間をクリアと誤認する�Eを防ぎまぁE
    if (g.enemyManager.enemies.length > 0 && g.enemyManager.areAllDead()) {
      g.wave += 1;
      g.enemyManager.wave = g.wave;
      g.enemyManager.spawnWave();
      
      // ウェーブクリア時�Eスロー演�E�E�演�Eとして timeScale を下げる！E
      g.timeScale = 0.2;
    }

    // スロー状態から徐、E��通常の速度(1.0)に復帰させめE
    if (g.timeScale < 1) {
      g.timeScale += 0.01;
    }

    // ゲームオーバ�E判宁E
    if (g.shield <= 0 && !g.isGameOver) {
      g.isGameOver = true;
      // 2秒後にリロードしてリトライ�E�忁E��に応じてUI表示に変更してください�E�E
      setTimeout(() => location.reload(), 2000);
    }
  }
}
