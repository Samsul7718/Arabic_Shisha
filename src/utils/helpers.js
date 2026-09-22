/**
 * Format currency with configured symbol
 */
export const formatCurrency = (amount, currencySymbol = '₹') => {
  return `${currencySymbol} ${amount}`;
};

/**
 * Format string based on active locale direction
 */
export const getDirection = (lang) => {
  return lang === 'ar' ? 'rtl' : 'ltr';
};
