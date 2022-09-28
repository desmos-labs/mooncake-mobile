import React from 'react';
import {render} from 'jest/utils/CustomRender';
import CustomRadioGroup from 'components/CustomRadioGroup/index';
import {fireEvent} from '@testing-library/react-native';

const options = [
  {
    label: 'A',
    value: 'a',
  },
  {
    label: 'B',
    value: 'b',
  },
  {
    label: 'C',
    value: 'c',
  },
];

describe('component: CustomRadioGroup', () => {
  it('renders', () => {
    const tree = render(
      <CustomRadioGroup
        values={options}
        selectedValue={0}
        onSelect={jest.fn}
      />,
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('calls onSelect when an option is selected', () => {
    const onSelectFn = jest.fn();
    const {getByLabelText} = render(
      <CustomRadioGroup
        values={options}
        selectedValue={0}
        onSelect={onSelectFn}
      />,
    );

    fireEvent.press(getByLabelText('a-radio-button'));

    expect(onSelectFn).toHaveBeenCalledWith(0, 'a');
  });
});
