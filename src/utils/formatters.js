/**
 * Format a number as currency string.
 * @param {number} amount
 * @param {string} currency
 */
export function formatCurrency(amount, currency = 'UAH') {
  return `${amount.toFixed(2)} ${currency}`;
}

/**
 * Format an ISO date string to a localized short date.
 * @param {string} isoString
 */
export function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString('uk-UA', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Format an ISO date string to a localized short date without year.
 * @param {string} isoString
 */
export function formatShortDate(isoString) {
  return new Date(isoString).toLocaleDateString('uk-UA', {
    day: '2-digit',
    month: 'short',
  });
}
