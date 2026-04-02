# GODUFO Portfolio

企業提出向けに整備したブラウザゲームです。ES Modules と責務分離により、可読性と保守性を重視しています。

## 1. 採用担当向けサマリー

- 目的: ゲームロジック実装力と設計改善力を短時間で確認できる提出物
- 想定閲覧時間: 5-10分
- 見てほしい点: モジュール分割、入力ハンドリング、UI更新の一貫性

## 2. 作成者情報

- 作成者: Takumi Harada
- 作成日: 2026-03-31
- ドキュメント最終更新日: 2026-03-31

## 3. ディレクトリ構成

```text
godufo-game/
  index.html
  style.css
  src/
    core/
    data/
    managers/
    ui/
    utils/
```

## 4. 実行方法

`type="module"` を利用しているため、`file://` 直開きではなくローカルサーバー経由で実行してください。

```powershell
cd C:\テスト\godufo-game
python -m http.server 5502
```

ブラウザで `http://localhost:5502/index.html` を開きます。

## 5. 品質チェック（Lint / Test）

```powershell
cd C:\テスト\godufo-game
npm install
npm run lint
npm run test
```

まとめて実行する場合:

```powershell
npm run check
```

CI: `.github/workflows/ci.yml`

### テスト方針

- `tests/utils.test.js` で入力検証と XSS エスケープのような壊れやすい基礎処理を先に固定しています。
- テスト名は「何を守るテストか」がすぐ伝わる日本語にそろえ、README の確認観点と対応づけています。
- ブラウザ実操作で確認する導線と、自動テストで保証する純粋ロジックを分けて説明できる構成にしています。

## 6. 関連文書

- SCREEN-OVERVIEW.md: 画面構成、操作導線、UI の見せ方
- DESIGN.md: 実装設計、主要クラス、更新処理、分岐の説明

## 7. 5分評価ガイド

1. タイトル画面から `INITIALIZE MISSION` で開始
2. マウス/タッチ移動、クリック/タップ発射を確認
3. `X` / `SPACE` / 画面ボタンで必殺技発動を確認
4. HUD の `SCORE / WAVE / SHIELD / SPECIAL` 更新を確認
5. `src/core/game-core.js` と `src/managers/*.js` を確認

## 8. 実装の工夫

- 依存関係を `import/export` に統一
- 命名規約（kebab-case / PascalCase）を整備
- `addEventListener` に統一してイベント責務を明確化
- デバッグログ依存を削減して提出品質を向上

## 9. 対応環境・既知の制約

- 推奨ブラウザ: Chrome / Edge の最新安定版
- スマホ操作: タッチ移動・発射に対応
- 既知の制約: ビルドツール無し構成（学習・確認容易性を優先）

## 10. 今後の改善

- E2E テスト追加による回帰検出力の強化

## 11. 提出チェックリスト

- [ ] 起動手順が再現できる
- [ ] `npm run lint` / `npm test` が通る
- [ ] 主要操作（移動・発射・必殺技）が確認できる
- [ ] README の評価ガイドに沿って説明できる
