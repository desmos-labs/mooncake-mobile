import { renderHook } from '@testing-library/react-native';
import useFormatDateToTZ from 'hooks/formatting/useFormatDateToTZ/index';
import { RecoilRoot } from 'recoil';

describe('hook: useFormatDateToTz', () => {
  it('formats the date to the specified format', () => {
    const timeToFormat = '2022-09-23T08:39:07+00:00';
    const format = 'dd MMM, HH:mm';
    const { result } = renderHook(useFormatDateToTZ, {
      wrapper: RecoilRoot,
    });

    expect(result.current(timeToFormat, format)).toEqual('23 Sep, 08:39');
  });
});
