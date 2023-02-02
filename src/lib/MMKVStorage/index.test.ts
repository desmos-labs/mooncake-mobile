import {getMMKV, MMKVKEYS, setMMKV} from 'lib/MMKVStorage/index';

describe('MMKVStorage', () => {
  const mockValue = {
    hello: 'world',
  };

  describe('getMMKV', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('retrieves a stored value from MMKV', () => {
      setMMKV(MMKVKEYS.EXAMPLE_KEY, mockValue);

      jest.spyOn(JSON, 'parse');

      expect(getMMKV(MMKVKEYS.EXAMPLE_KEY)).toEqual(mockValue);

      // retrieved values should be JSON stringified
      expect(JSON.parse).toHaveBeenCalledWith(JSON.stringify(mockValue));
    });
  });

  describe('setMMKV', () => {
    it('stringifies and when writing to MMKV', () => {
      jest.spyOn(JSON, 'stringify');

      setMMKV(MMKVKEYS.EXAMPLE_KEY, mockValue);

      expect(JSON.stringify).toHaveBeenCalledWith(mockValue);
    });
  });
});
