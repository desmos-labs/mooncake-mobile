import {
  formatFeeWithDenoms,
  formatMsToHumanReadable,
  formatNumShorthand,
  mapPostFontSize,
  sanitizeMnemonic,
} from 'lib/FormatUtils/index';

describe('utils: FormatUtils', () => {
  describe('formatNumShorthand', () => {
    it('leaves numbers less than 1000 as-is', () => {
      expect(formatNumShorthand(999)).toEqual('999');
    });

    it('formats 999k and under', () => {
      expect(formatNumShorthand(999999)).toEqual('999.999k');

      expect(formatNumShorthand(10000)).toEqual('10k');
    });

    it('formats 1 million and higher', () => {
      expect(formatNumShorthand(1000000)).toEqual('1m');

      expect(formatNumShorthand(10000000)).toEqual('10m');
    });
  });

  describe('sanitizeMnemonic', () => {
    it('sanitizes strings properly', () => {
      // eslint-disable-next-line no-useless-concat
      expect(sanitizeMnemonic('outpu\n\n' + 'joy\n\n' + 'happy \n\n')).toEqual(
        'outpu joy happy',
      );
    });
  });

  describe('mapPostFontSize', () => {
    it('fontSize === 22 for numChars < 201', () => {
      expect(mapPostFontSize(200)).toBe(22);
    });

    it('fontSize === 20 for numChars > 200 && numChars < 251', () => {
      expect(mapPostFontSize(201)).toBe(20);
      expect(mapPostFontSize(250)).toBe(20);
    });

    it('fontSize === 18 for numChars > 250 && numChars < 351', () => {
      expect(mapPostFontSize(251)).toBe(18);
      expect(mapPostFontSize(350)).toBe(18);
    });

    it('fontSize === 16 for numChars > 350 && numChars < 451', () => {
      expect(mapPostFontSize(351)).toBe(16);
      expect(mapPostFontSize(450)).toBe(16);
    });

    it('fontSize === 14 for numChars > 450 && numChars < 501', () => {
      expect(mapPostFontSize(451)).toBe(14);
      expect(mapPostFontSize(500)).toBe(14);
    });
  });

  describe('formatMsToHumanReadable', () => {
    it('formats to seconds (rounds up)', () => {
      expect(formatMsToHumanReadable(1500, 'seconds')).toEqual(2);
    });

    it('formats to minutes (rounds up)', () => {
      expect(formatMsToHumanReadable(60000 * 1.5, 'minutes')).toEqual(2);
    });

    it('formats to hours (rounds up)', () => {
      expect(formatMsToHumanReadable(3600000 * 1.5, 'hours')).toEqual(2);
    });

    it('formats to days (rounds up)', () => {
      expect(formatMsToHumanReadable(86400000 * 1.5, 'days')).toEqual(2);
    });
  });

  describe('formatFeeWithDenoms', () => {
    const mockArgs = {
      amount: [
        {
          denom: 'daric',
          amount: '1000',
        },
      ],
      gas: '500',
    };

    it('formats with correct denoms', () => {
      expect(formatFeeWithDenoms(mockArgs)).toEqual({
        denom: 'daric',
        formattedAmount: 0.001,
        formattedString: '0.001 DARIC',
      });
    });

    it('throws an error if no matchingDenoms are found', () => {
      expect(() =>
        formatFeeWithDenoms({
          amount: [
            {
              denom: 'denom that does not exist',
              amount: '1000',
            },
          ],
          gas: '500',
        }),
      ).toThrow(
        `No matching denoms found for denom: denom that does not exist`,
      );
    });
  });
});
