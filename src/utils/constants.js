/**
 * @author Takumi Harada
 * @date 2026-03-31
 */
/**
 * 定数概要:
 * - GAME_CONFIG は描画サイズ、初期耐久、特殊ゲージ上限などゲーム全体設定をまとめる
 * - INPUT_KEYS は特殊攻撃に割り当てる入力キーを定義する
 * - UI_TEXT はタイトルやコピーライトなど固定表示文言を管理する
 */
export const GAME_CONFIG = {
  CANVAS_WIDTH: 600,
  CANVAS_HEIGHT: 750,
  START_SHIELD: 100,
  MAX_POWER_LEVEL: 5,
  SPECIAL_ENERGY_MAX: 100,
};

export const INPUT_KEYS = {
  SPECIAL: ["KeyX", "Space"],
};

export const UI_TEXT = {
  TITLE: "宇宙大戦",
  COPYRIGHT: "© 2026 UFO GOD CORP.",
};
