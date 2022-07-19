/* eslint-disable import/prefer-default-export */
import {EnglishMnemonic} from '@cosmjs/crypto';

/**
 * Validate a given mnemonic.
 * @param mnemonic - The mnemonic to be checked.
 */
export const validateMnemonic = (mnemonic: string): boolean => {
  try {
    const check = new EnglishMnemonic(mnemonic);
    return !!check;
  } catch {
    return false;
  }
};
