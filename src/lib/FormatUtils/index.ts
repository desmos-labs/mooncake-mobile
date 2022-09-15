/**
 * File for all formatting related utils
 */

import {HdPath} from 'types/hdpath';
import {Slip10RawIndex} from '@cosmjs/crypto';
import {StdFee} from '@cosmjs/amino';
import LinkableChains from 'config/LinkableChains';
import _ from 'lodash';
import {differenceInYears, format} from 'date-fns';

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

/**
 * Format an estimated fee from its base denoms.
 *
 * @param fee The estimated fee, preferably one of the outputs computeTxFees
 */
export const formatFeeWithDenoms = (fee: StdFee) => {
  const {amount} = fee;

  const [_fee] = amount;

  const {amount: feeAmount, denom} = _fee;

  // Find matching denom data based on stored ChainAsset data and the denom
  // from fee estimation
  const flattenedChainAssets = _.flatten(LinkableChains.map(x => x.assets));
  const flattenedDenomUnits = _.flatten(
    flattenedChainAssets.map(x => x && x.denom_units),
  );

  // This relies on chains using a u-prefix for their base denoms, otherwise
  // special handling will need to be added
  const matchingDenoms: {denom: string; exponent: number} | undefined =
    flattenedDenomUnits.find(x => x && x.denom === denom.replace('u', ''));

  if (!matchingDenoms) {
    throw new Error(`No matching denoms found for denom: ${denom}`);
  }
  const {exponent, denom: matchingDenom} = matchingDenoms;

  const formattedAmount = parseFloat(feeAmount) / 10 ** exponent;

  return {
    formattedAmount,
    denom: matchingDenom,
    formattedString: `${formattedAmount} ${matchingDenom.toUpperCase()}`,
  };
};

/**
 * Format a date so that if it is in the same year, it is displayed as dd MMM, HH:mm
 * if it is a different year, display as ccc MMM dd yyyy
 */
export const formatDateForPostDetails = (dateToFormat: any) => {
  console.log(dateToFormat);
  const date = new Date(dateToFormat);

  if (differenceInYears(date, Date.now()) === 0) {
    return format(date, 'dd MMM, HH:mm');
  }
  return format(date, 'ccc MMM dd yyyy');
};
