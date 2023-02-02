import {
  validateMin1Lowercase,
  validateMin1SpecialChar,
  validateMin1Uppercase,
  validateMinPwLength,
  validateMnemonic,
} from 'lib/ValidationUtils/index';

describe('lib/ValidationUtils', () => {
  describe('validateMnemonic', () => {
    it('returns true for valid mnemonics', () => {
      const mnemonic =
        'weekend sick lamp smile year apart tail bright loyal suffer narrow six vacant festival true arctic blur car mechanic novel test tongue glance gate';
      expect(validateMnemonic(mnemonic)).toBeTruthy();
    });

    it('returns false for invalid mnemonics', () => {
      const invalidMnemonic =
        'weekend sick lamp smile year apart tail bright loyal suffer narrow six vacant festival true blur car mechanic novel test tongue glance hello';

      expect(validateMnemonic(invalidMnemonic)).toBeFalsy();
    });
  });

  describe('validateMinPWLength', () => {
    it('is false if param is undefined', () => {
      expect(validateMinPwLength('')).toBeFalsy();
    });

    it('enforces MIN_PW_LENGTH >= 10', () => {
      expect(validateMinPwLength('exact10cha')).toBeTruthy();

      expect(validateMinPwLength('this_is_a_string_with_more_than_10_chars')).toBeTruthy();
    });
  });

  describe('validateMin1Lowercase', () => {
    it('returns false if undefined, empty, or no lowercase', () => {
      expect(validateMin1Lowercase('')).toBeFalsy();

      expect(validateMin1Lowercase(undefined)).toBeFalsy();

      expect(validateMin1Lowercase('NO_LOWERCASE_HERE')).toBeFalsy();
    });

    it('returns true if at least 1 lowercase is in string', () => {
      expect(validateMin1Lowercase('I_AM_A_STRING_WITH_a_LOWERCASE')).toBeTruthy();

      expect(validateMin1Lowercase('I_AM_A_STRING_WITH_a_loWERCASE')).toBeTruthy();
    });
  });

  describe('validateMin1Uppercase', () => {
    it('returns false if undefined, empty, or no uppercase', () => {
      expect(validateMin1Uppercase('')).toBeFalsy();

      expect(validateMin1Uppercase(undefined)).toBeFalsy();

      expect(validateMin1Uppercase('no_uppercase_here')).toBeFalsy();
    });

    it('returns true if at least 1 uppercase is in string', () => {
      expect(validateMin1Uppercase('tEsting')).toBeTruthy();

      expect(validateMin1Uppercase('TESting')).toBeTruthy();
    });
  });

  describe('validateMin1SpecialChar', () => {
    it('returns false if undefined, empty, or no uppercase', () => {
      expect(validateMin1SpecialChar('')).toBeFalsy();

      expect(validateMin1SpecialChar(undefined)).toBeFalsy();

      expect(validateMin1SpecialChar('no_uppercase_here')).toBeFalsy();
    });

    it('returns true if at least 1 special character is in string', () => {
      expect(validateMin1SpecialChar('testing!')).toBeTruthy();

      expect(validateMin1SpecialChar('testing@#')).toBeTruthy();
    });
  });
});
