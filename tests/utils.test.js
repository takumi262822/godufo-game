/**
 * @author Takumi Harada
 * @date 2026-03-31
 */
import test from 'node:test';
import assert from 'node:assert/strict';

import { FormValidator } from '../src/utils/validation.js';
import { XssSanitizer } from '../src/utils/xss.js';

test('FormValidator.validateScore validates integer range 0-9999999', () => {
  assert.equal(FormValidator.validateScore(0), true);
  assert.equal(FormValidator.validateScore(9999999), true);
  assert.equal(FormValidator.validateScore(-1), false);
  assert.equal(FormValidator.validateScore(10000000), false);
  assert.equal(FormValidator.validateScore('abc'), false);
});

test('XssSanitizer.escapeHtml escapes dangerous HTML characters', () => {
  const raw = `<img src=x onerror="alert('xss')">`;
  const escaped = XssSanitizer.escapeHtml(raw);

  assert.equal(escaped.includes('<'), false);
  assert.equal(escaped.includes('>'), false);
  assert.equal(escaped.includes('&lt;img'), true);
});
