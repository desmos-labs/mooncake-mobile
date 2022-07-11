/**
 * File for all formatting related utils
 */

/**
 * Very naive way to format interactionCount into something like 5000 > 5k
 */
// eslint-disable-next-line import/prefer-default-export
export const formatNumShorthand = (value: number): string => {
  if (value < 1000) {
    return value.toString(10);
  }
  if (value < 1000000) return `${value / 1000}k`;
  return `${value / 1000000}m`;
};
