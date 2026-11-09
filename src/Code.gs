/** Spreadsheet-bound installable On form submit handler. See docs/SETUP.md. */
function handleFormSubmit(e) {
  if (!e || !e.range) throw new Error('Use a spreadsheet form-submit trigger');
  const sheet = e.range.getSheet();
  if (sheet.getName() !== 'Form_Responses' || e.range.getRow() < 2) return;
  const lock = LockService.getDocumentLock();
  lock.waitLock(30000);
  try {
    const row = e.range.getRow();
    // A request ID marks an already handled event; never reset a review decision.
    if (sheet.getRange(row, 15).getValue()) return;
    const values = sheet.getRange(row, 1, 1, 8).getValues()[0];
    let validation = 'VALID';
    let systemCost = '';
    try {
      const code = normalizeItemCode(values[3]);
      const settings = e.source.getSheetByName('Settings');
      if (!settings) throw new Error('Settings sheet missing');
      const rate = settings.getRange('B1').getValue();
      if (typeof values[5] !== 'number' || !Number.isFinite(values[5]) || values[5] <= 0)
        throw new Error('MRP must be a positive number');
      if (!values[1] || !values[2] || !values[7]) throw new Error('Email, branch and reason required');
      systemCost = calculateSystemCost(values[4], values[6], rate);
      sheet.getRange(row, 4).setNumberFormat('@').setValue(code);
    } catch (error) {
      validation = 'ERROR: ' + error.message;
    }
    sheet.getRange(row, 9).setValue(systemCost).setNumberFormat('0.00');
    sheet.getRange(row, 13).setValue('PENDING');
    sheet.getRange(row, 24).setValue(validation);
    // Write identifier last: a partial failure can be retried before review begins.
    sheet.getRange(row, 15).setValue(Utilities.getUuid());
  } finally {
    lock.releaseLock();
  }
}

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
