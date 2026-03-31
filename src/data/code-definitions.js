import { ENEMY_TYPES } from "./enemy-data.js";

export const CODE_DEFINITIONS = {
  ENEMY_TYPES,
};

/**
 * EnemyCode クラス
 * @author Takumi Harada
 * @date 2026-03-31
 */
export class EnemyCode {
  static getByName(name) {
    return ENEMY_TYPES.find((enemy) => enemy.name === name);
  }
}
