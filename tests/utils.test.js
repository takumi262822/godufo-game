/**
 * @author Takumi Harada
 * @date 2026-03-31
 */
import test from 'node:test';
import assert from 'node:assert/strict';

import { FormValidator } from '../src/utils/validation.js';
import { XssSanitizer } from '../src/utils/xss.js';

// スコア入力が許可された整数範囲内に収まるかを確認する。
test('スコア入力が 0 から 9999999 の整数範囲に収まること', () => {
  assert.equal(FormValidator.validateScore(0), true);
  assert.equal(FormValidator.validateScore(9999999), true);
  assert.equal(FormValidator.validateScore(-1), false);
  assert.equal(FormValidator.validateScore(10000000), false);
  assert.equal(FormValidator.validateScore('abc'), false);
});

// HTML特殊文字を無害化してタグとして解釈されないことを確認する。
test('危険な HTML 文字列がエスケープされて無害化されること', () => {
  const raw = `<img src=x onerror="alert('xss')">`;
  const escaped = XssSanitizer.escapeHtml(raw);

  assert.equal(escaped.includes('<'), false);
  assert.equal(escaped.includes('>'), false);
  assert.equal(escaped.includes('&lt;img'), true);
});
