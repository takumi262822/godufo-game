/**
 * 敵ユニット�EバリエーションチE�Eタ�E��E期設定値を厳守！E
 * @author Takumi Harada
 * @date 2026-03-31
 */
/**
 * 定数概要:
 * - EnemyType 系クラスは敵ごとのHP、サイズ、移動倍率、射撃頻度、撃破スコアを定義する
 * - ENEMY_TYPES はウェーブ生成時に再利用する敵テンプレート配列
 */
/**
 * EnemyType クラス
 * 目的: このクラスの責務を実行する
 * 入力: 状態値・設定値・ユーザー操作
 * 処理: 責務に沿って判定/更新/制御を行う
 * 出力: 更新済みの状態または表示結果
 * 補足: 詳細は DESIGN.md のクラス設計を参照
 * @author Takumi Harada
 * @date 2026-04-01
 */
class EnemyType {
    constructor({ name, shape, hue, hp, speedMult, agility, shootRate, score, size }) {
        Object.assign(this, { name, shape, hue, hp, speedMult, agility, shootRate, score, size });
    }

    createEnemy(x, y, baseSpeed) {
        return {
            name: this.name,
            shape: this.shape,
            hue: this.hue,
            hp: this.hp,
            maxHp: this.hp,
            speedMult: this.speedMult,
            agility: this.agility,
            shootRate: this.shootRate,
            score: this.score,
            w: this.size.w, // ここで初期設定�E w を適用
            h: this.size.h, // ここで初期設定�E h を適用
            x, y,
            vX: (Math.random() - 0.5) * baseSpeed * this.speedMult,
            vY: (Math.random() - 0.5) * baseSpeed * this.speedMult,
            alive: true,
            isBoss: false,
            angle: Math.random() * Math.PI * 2
        };
    }
}

// 吁E��ラスのサイズ(size: {w, h})を�Eの設定に完�E復帰
/**
 * Stinger クラス
 * 目的: このクラスの責務を実行する
 * 入力: 状態値・設定値・ユーザー操作
 * 処理: 責務に沿って判定/更新/制御を行う
 * 出力: 更新済みの状態または表示結果
 * 補足: 詳細は DESIGN.md のクラス設計を参照
 * @author Takumi Harada
 * @date 2026-04-01
 */
class Stinger extends EnemyType {
    constructor() {
        super({ name: "STINGER", shape: "TRIANGLE", hue: 190, hp: 1, speedMult: 1.6, agility: 0.05, shootRate: 0.004, score: 150, size: { w: 25, h: 25 } });
    }
}

/**
 * OctaCore クラス
 * 目的: このクラスの責務を実行する
 * 入力: 状態値・設定値・ユーザー操作
 * 処理: 責務に沿って判定/更新/制御を行う
 * 出力: 更新済みの状態または表示結果
 * 補足: 詳細は DESIGN.md のクラス設計を参照
 * @author Takumi Harada
 * @date 2026-04-01
 */
class OctaCore extends EnemyType {
    constructor() {
        super({ name: "OCTA-CORE", shape: "OCTAGON", hue: 280, hp: 2, speedMult: 1.0, agility: 0.02, shootRate: 0.007, score: 300, size: { w: 30, h: 30 } });
    }
}

/**
 * Cruiser クラス
 * 目的: このクラスの責務を実行する
 * 入力: 状態値・設定値・ユーザー操作
 * 処理: 責務に沿って判定/更新/制御を行う
 * 出力: 更新済みの状態または表示結果
 * 補足: 詳細は DESIGN.md のクラス設計を参照
 * @author Takumi Harada
 * @date 2026-04-01
 */
class Cruiser extends EnemyType {
    constructor() {
        super({ name: "CRUISER", shape: "HEXAGON", hue: 0, hp: 5, speedMult: 0.7, agility: 0.01, shootRate: 0.012, score: 600, size: { w: 45, h: 25 } });
    }
}

/**
 * VoidEye クラス
 * 目的: このクラスの責務を実行する
 * 入力: 状態値・設定値・ユーザー操作
 * 処理: 責務に沿って判定/更新/制御を行う
 * 出力: 更新済みの状態または表示結果
 * 補足: 詳細は DESIGN.md のクラス設計を参照
 * @author Takumi Harada
 * @date 2026-04-01
 */
class VoidEye extends EnemyType {
    constructor() {
        super({ name: "VOID-EYE", shape: "DIAMOND", hue: 120, hp: 1, speedMult: 1.3, agility: 0.04, shootRate: 0.005, score: 200, size: { w: 20, h: 35 } });
    }
}

export const ENEMY_TYPES = [
    new Stinger(),
    new OctaCore(),
    new Cruiser(),
    new VoidEye()
];
