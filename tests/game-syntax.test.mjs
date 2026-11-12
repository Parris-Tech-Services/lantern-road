import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('game.js compiles without syntax errors', () => {
  const source = readFileSync(new URL('../game.js', import.meta.url), 'utf8');
  assert.doesNotThrow(() => new Function(source));
});
