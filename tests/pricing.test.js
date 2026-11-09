const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const {normalizeItemCode, calculateSystemCost} = require('../src/pricing');
test('numeric ERP identifiers retain leading zeros', () => {
  for (const code of [2626, '2626', '002626', "'002626"])
    assert.equal(normalizeItemCode(code), '002626');
  for (const code of ['', '1234567', 'AB26', '-12'])
    assert.throws(() => normalizeItemCode(code));
});
test('tax normalization and upward rounding follow invoice type', () => {
  assert.equal(calculateSystemCost(100,'Cost',0.18),118);
  assert.equal(calculateSystemCost(100,'V.Cost',0.18),100);
  assert.equal(calculateSystemCost(100,'Non Vat Cost',0.18),100);
  assert.equal(calculateSystemCost(100,'Cost',0),100);
  assert.equal(calculateSystemCost(10.001,'V.Cost',0.18),10.01);
  assert.equal(calculateSystemCost(0.1,'Cost',0.18),0.12);
});
test('invalid inputs never silently become a valid cost', () => {
  for (const cost of [0,-1,'100',NaN,Infinity])
    assert.throws(() => calculateSystemCost(cost,'Cost',0.18));
  for (const rate of ['',-0.1,18,NaN])
    assert.throws(() => calculateSystemCost(100,'Cost',rate));
  assert.throws(() => calculateSystemCost(100,'Other',0.18));
});
test('tested pure functions match deployable Apps Script', () => {
  const gs = fs.readFileSync(require.resolve('../src/Code.gs'),'utf8');
  const js = fs.readFileSync(require.resolve('../src/pricing.js'),'utf8');
  assert.equal(gs.slice(gs.indexOf('function normalizeItemCode')).trim(),
    js.slice(0,js.indexOf("if (typeof module")).trim());
});
