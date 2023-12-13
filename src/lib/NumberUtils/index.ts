/**
 * Gets the decimal separator used on the provided locale.
 * @param locale - The locale to us, if empty use the current one.
 */
export const getDecimalSeparator = (locale?: string) => {
  // Get the decimal separator characters used in the locale.
  const [, separator] = (1.1).toLocaleString(locale);
  return separator;
};

/**
 * Gets the thousands separator used on the provided locale.
 * @param locale - The locale to us, if empty use the current one.
 */
export const getThousandsSeparator = (locale?: string) => {
  // Get the thousands separator characters used in the locale.
  const [, separator] = (1000).toLocaleString(locale);
  // Handle the case of locales without thousands separator.
  return separator === '0' ? '' : separator;
};

/**
 * Checks if the provided string is a valid number.
 * Note: This function don't allow the presence of the thousand separator.
 * @param value - The value to check.
 */
export const isStringNumberValid = (value: string): boolean => {
  const valueWithoutThousandsSeparators = value.replace(
    new RegExp(`[${getThousandsSeparator()}]`, 'g'),
    '',
  );
  const testRe = new RegExp(`^[0-9]+${getDecimalSeparator()}?([0-9]+)?$`);
  return testRe.test(valueWithoutThousandsSeparators);
};

/**
 * Parse a number using the current locale or the provided one.
 * @param value - Value to be parsed
 * @param locale - The locale to us, if empty use the current one.
 */
export const safeParseFloat = (value: string | undefined, locale?: string) => {
  const decimalSeparator = getDecimalSeparator(locale);
  const thousandsSeparator = getThousandsSeparator(locale);

  // Remove thousands separators, and put a point where the decimal separator occurs
  const string = Array.from(value || '0', c => {
    if (c === thousandsSeparator) {
      return '';
    }
    if (c === decimalSeparator) {
      return '.';
    }
    return c;
  }).join('');
  const parsed = parseFloat(string);
  return Number.isNaN(parsed) ? 0 : parsed;
};
