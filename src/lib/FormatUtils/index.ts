/**
 * File for all formatting related utils
 */
import { Coin, convertCoin, Currency } from '@desmoslabs/desmjs';
import { SupportedChains } from 'config/LinkableChains';
import numbro from 'numbro';

/**
 * Very naive way to format interactionCount into something like 5000 > 5k
 */

export const formatNumShorthand = (value: number): string => {
  if (value < 1000) {
    return value.toString(10);
  }
  if (value < 1000000) {
    return `${value / 1000}k`;
  }
  return `${value / 1000000}m`;
};

// Remove newline characters and leading/trailing spaces from mnemonics
export const sanitizeMnemonic = (mnemonic: string) => {
  return mnemonic.replace(/\n\n/g, ' ').trim();
};

/**
 * Gets the decimal separator used on the provided locale.
 * @param locale - The locale to us, if empty use the current one.
 */
const getDecimalSeparator = (locale?: string) => {
  // Get the thousands and decimal separator characters used in the locale.
  const [, separator] = (1.1).toLocaleString(locale);
  return separator;
};

/**
 * Parse a number using the current locale or the provided one.
 * @param value - Value to be parsed
 * @param locale - The locale to us, if empty use the current one.
 */
export const safeParseFloat = (value: string | undefined, locale?: string) => {
  const separator = getDecimalSeparator(locale);

  // Remove thousands separators, and put a point where the decimal separator occurs
  const string = Array.from(value || '0', c => (c === separator ? '.' : c)).join('');
  const parsed = parseFloat(string);
  return Number.isNaN(parsed) ? 0 : parsed;
};

/**
 * Formats the given value into a human-readable string.
 * @param value - Value to be formatted
 * @param decimalPlaces - Optional number of decimal places to be used.
 */
export const formatNumber = (value: number, decimalPlaces: number = 6): string =>
  numbro(value).format({
    thousandSeparated: true,
    mantissa: decimalPlaces,
    trimMantissa: true,
  });

/**
 * Formats the given value as a currency amount.
 * @param value - Value to format
 */
export const formatCurrencyAmount = (value: number): string => formatNumber(value, 2);

const getChainCurrencies = (): Currency[] => {
  return SupportedChains.flatMap(chain => chain.chainInfo || []).flatMap(info => info.currencies);
};

/**
 * Formats the given amount into a human-readable value.
 * @param amount - Coin that should be formatted.
 */
export const formatCoin = (amount: Coin): string => {
  const currencies = getChainCurrencies();
  const convertedAmount = convertCoin(amount, 6, currencies) || amount;
  const humanReadableAmount = formatNumber(safeParseFloat(convertedAmount.amount));
  return `${humanReadableAmount} ${convertedAmount.denom.toUpperCase()}`;
};

/**
 * Formats the given coins and returns a string representing the overall amount.
 * @param amount - Amount to be formatted.
 * @param separator - Optional separator to be used.
 */
export const formatCoins = (
  amount: readonly Coin[] | undefined,
  separator: string = '\n',
): string => (amount || []).map(formatCoin).join(separator);

export const mapPostFontSize = (numChars: number) => {
  let fontSize = 14;
  if (numChars < 201) {
    fontSize = 22;
  } else if (numChars < 251) {
    fontSize = 20;
  } else if (numChars < 351) {
    fontSize = 18;
  } else if (numChars < 451) {
    fontSize = 16;
  }

  return fontSize;
};

const msUnitMap: { [index: string]: number } = {
  seconds: 1000,
  minutes: 60000,
  hours: 3600000,
  days: 86400000,
};

/**
 * Formats a given millisecond value into a given time unit.
 */
export const formatMsToHumanReadable = (
  ms: number,
  unit: 'seconds' | 'minutes' | 'hours' | 'days',
) => {
  return Number((ms / msUnitMap[unit]).toFixed(0));
};
