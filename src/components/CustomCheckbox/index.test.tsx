import React from 'react';

import {render} from 'jest/utils/CustomRender';
import CustomCheckbox from 'components/CustomCheckbox/index';
import {fireEvent} from '@testing-library/react-native';
import {
  advanceAnimationByTime,
  withReanimatedTimer,
  // @ts-ignore
} from 'react-native-reanimated/lib/reanimated2/jestUtils';

describe('component: CustomCheckbox', () => {
  it('renders checked', () => {
    withReanimatedTimer(() => {
      const tree = render(
        <>
          <CustomCheckbox checked handlePress={jest.fn} />,
        </>,
      ).toJSON();

      expect(tree).toMatchSnapshot();
    });
  });

  it('renders unchecked', () => {
    withReanimatedTimer(() => {
      const tree = render(
        <>
          <CustomCheckbox handlePress={jest.fn} />,
        </>,
      ).toJSON();

      advanceAnimationByTime(250);
      expect(tree).toMatchSnapshot();
    });
  });

  it('calls handlePress when pressed', () => {
    withReanimatedTimer(() => {
      const handlePressFn = jest.fn();

      const {getByLabelText} = render(
        <CustomCheckbox handlePress={handlePressFn} />,
      );

      fireEvent.press(getByLabelText('custom-checkbox'));
      advanceAnimationByTime(250);
      expect(handlePressFn).toHaveBeenCalledTimes(1);
    });
  });
});
