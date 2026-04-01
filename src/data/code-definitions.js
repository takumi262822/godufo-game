import { ENEMY_TYPES } from "./enemy-data.js";

/**
 * 定数概要:
 * - CODE_DEFINITIONS は敵タイプ一覧など横断参照するコード定義を束ねる
 * - EnemyCode は敵名から対応する敵テンプレートを取得する参照ヘルパー
 */
export const CODE_DEFINITIONS = {
  ENEMY_TYPES,
};

/**
 * EnemyCode クラス
 * @author Takumi Harada
 * @date 2026-03-31
 */
/**
 * EnemyCode クラス
 * 目的: このクラスの責務を実行する
 * 入力: 状態値・設定値・ユーザー操作
 * 処理: 責務に沿って判定/更新/制御を行う
 * 出力: 更新済みの状態または表示結果
 * 補足: 詳細は DESIGN.md のクラス設計を参照
 * @author Takumi Harada
 * @date 2026-04-01
 */
export class EnemyCode {
  static getByName(name) {
    return ENEMY_TYPES.find((enemy) => enemy.name === name);
  }
}
