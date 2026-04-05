/**
 * 敵ユニットのバリエーションデータ（初期設定値）。
 * @author Takumi Harada
 * @date 2026/3/31
 */
/**
 * 定数概要:
 * - EnemyType 系クラスは敵ごとのHP、サイズ、移動倍率、射撃頻度、撃破スコアを定義する
 * - ENEMY_TYPES はウェーブ生成時に再利用する敵テンプレート配列
 */
/**
 * 敵ユニット1種の定義値を保持し、指定座標に初期状態オブジェクトを生成する基底クラス。
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
/** 高速・HP1の三角形型敵。すばやい動きと低射撃頻度が特徴。スコア150点。 */
class Stinger extends EnemyType {
    constructor() {
        super({ name: "STINGER", shape: "TRIANGLE", hue: 190, hp: 1, speedMult: 1.6, agility: 0.05, shootRate: 0.004, score: 150, size: { w: 25, h: 25 } });
    }
}

/** 標準速・HP2の八角形型敵。射撃頻度が高く中盤以降に登場する。スコア300点。 */
class OctaCore extends EnemyType {
    constructor() {
        super({ name: "OCTA-CORE", shape: "OCTAGON", hue: 280, hp: 2, speedMult: 1.0, agility: 0.02, shootRate: 0.007, score: 300, size: { w: 30, h: 30 } });
    }
}

/** 低速・HP5の六角形型敵。射撃頻度最大の重装型。スコア600点。 */
class Cruiser extends EnemyType {
    constructor() {
        super({ name: "CRUISER", shape: "HEXAGON", hue: 0, hp: 5, speedMult: 0.7, agility: 0.01, shootRate: 0.012, score: 600, size: { w: 45, h: 25 } });
    }
}

/** 高機動・HP1のひし形型敵。ランダムな動きが予測しにくい。スコア200点。 */
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
