/**
 * StateManager クラス
 * @author Takumi Harada
 * @date 2026-03-31
 */
/**
 * StateManager クラス
 * 目的: 機能領域ごとの処理を管理する
 * 入力: ゲーム状態・イベント・対象オブジェクト
 * 処理: 責務領域の更新・判定・連携を行う
 * 出力: 領域ごとの処理結果
 * 補足: 単一責務を維持し必要最小限で連携する
 * @author Takumi Harada
 * @date 2026-04-01
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
