/**
 * File for all formatting related utils
 */

import {HdPath} from 'types/hdpath';
import {Slip10RawIndex} from '@cosmjs/crypto';

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

// Remove newline characters and leading/trailing spaces from mnemonics
export const sanitizeMnemonic = (mnemonic: string) => {
  return mnemonic.replace(/\n\n/g, ' ').trim();
};

/**
 * Converts our hdpath object to a cosmjs hdpath object.
 * @param hdPath hdpath object to covert.
 */
export const toCosmjsHdPath = (hdPath: HdPath) => {
  return [
    Slip10RawIndex.hardened(44),
    Slip10RawIndex.hardened(hdPath.coinType),
    Slip10RawIndex.hardened(hdPath.account),
    Slip10RawIndex.normal(hdPath.change),
    Slip10RawIndex.normal(hdPath.addressIndex),
  ];
};

/**
 * Removes all non number characters from a string
 */
export const removeNonNumbers = (value: string) =>
  value.replace(/[^0-9.]/g, '');
