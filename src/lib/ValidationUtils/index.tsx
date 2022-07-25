import {EnglishMnemonic} from '@cosmjs/crypto';

export const MIN_PW_LENGTH = 10;

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

export const validateMinPwLength = (value: string | undefined) => {
  if (!value) return false;
  return value.length >= MIN_PW_LENGTH;
};
export const validateMin1Lowercase = (value: string | undefined) =>
  /(?=.*[a-z])/.test(value || '');

export const validateMin1Uppercase = (value: string | undefined) =>
  /(?=.*[A-Z])/.test(value || '');

export const validateMin1SpecialChar = (value: string | undefined) =>
  /(?=.*\W)/.test(value || '');
