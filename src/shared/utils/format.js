/**
 * Format number to Rupiah currency format with thousand separator
 * @param {string|number} value - The value to format
 * @returns {string} Formatted string with thousand separator (e.g., "1.000")
 */
export const formatRupiah = (value) => {
  if (!value && value !== 0) return '';
  
  // Remove all non-digit characters
  const numericValue = value.toString().replace(/[^\d]/g, '');
  
  if (!numericValue) return '';
  
  // Format with thousand separator
  return parseInt(numericValue).toLocaleString('id-ID');
};

/**
 * Parse formatted rupiah string to numeric value
 * @param {string} formattedValue - The formatted string (e.g., "1.000")
 * @returns {string} Numeric string without formatting (e.g., "1000")
 */
export const parseRupiah = (formattedValue) => {
  if (!formattedValue) return '';
  // Remove all non-digit characters
  return formattedValue.toString().replace(/[^\d]/g, '');
};

/**
 * Format value to full IDR label (e.g., "Rp 1.000")
 * @param {string|number} value
 * @param {Object} options
 * @param {string} options.prefix
 * @param {string} options.fallback
 * @returns {string}
 */
export const formatCurrencyIDR = (value, options = {}) => {
  const { prefix = "Rp", fallback = "Rp 0" } = options;
  const formatted = formatRupiah(value);
  if (!formatted) return fallback;
  return `${prefix} ${formatted}`;
};
