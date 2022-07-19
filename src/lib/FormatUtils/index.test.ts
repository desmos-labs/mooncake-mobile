import {formatNumShorthand, sanitizeMnemonic} from 'lib/FormatUtils/index';

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
});
