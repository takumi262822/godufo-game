import { ENEMY_TYPES } from "./enemy-data.js";

/**
 * ENEMY_TYPES など横断参照するコード定義を包括する定数オブジェクト。
 */
export const CODE_DEFINITIONS = {
  ENEMY_TYPES,
};

/**
 * 敵名から ENEMY_TYPES 定義テンプレートを検索するヘルパークラス。
 * @author Takumi Harada
 */
export class EnemyCode {
  static getByName(name) {
    return ENEMY_TYPES.find((enemy) => enemy.name === name);
  }
}
