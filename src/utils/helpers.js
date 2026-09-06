/**
 * Format currency with configured symbol
 */
export const formatCurrency = (amount, currencySymbol = 'AED') => {
  return `${amount} ${currencySymbol}`;
};

/**
 * Format string based on active locale direction
 */
export const getDirection = (lang) => {
  return lang === 'ar' ? 'rtl' : 'ltr';
};
