function normalizeItemCode(value) {
  const code = String(value).trim().replace(/^'+/, '');
  if (!/^\d{1,6}$/.test(code)) throw new Error('Item code must contain 1–6 digits');
  return code.padStart(6, '0');
}
function calculateSystemCost(cost, type, rate) {
  if (typeof cost !== 'number' || !Number.isFinite(cost) || cost <= 0)
    throw new Error('Cost must be a positive number');
  if (typeof rate !== 'number' || !Number.isFinite(rate) || rate < 0 || rate > 1)
    throw new Error('Tax rate must be a decimal from 0 to 1');
  if (!['Cost', 'V.Cost', 'Non Vat Cost'].includes(type)) throw new Error('Unknown cost type');
  const value = cost * (type === 'Cost' ? 1 + rate : 1);
  // Remove insignificant floating-point noise before rounding upward.
  return Math.ceil(Number((value * 100).toFixed(8))) / 100;
}
if (typeof module !== 'undefined') module.exports = {normalizeItemCode, calculateSystemCost};
