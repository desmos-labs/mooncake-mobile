import React from 'react';
import {render} from 'jest/utils/CustomWrappers';
import BackButton from 'components/BackButton/index';
import {fireEvent} from '@testing-library/react-native';

describe('component: BackButton', () => {
  it('renders', () => {
    const tree = render(<BackButton onPress={jest.fn} />).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('calls the onPress prop function when pressed', () => {
    const onPressFn = jest.fn();

    const {getByLabelText} = render(<BackButton onPress={onPressFn} />);

    fireEvent.press(getByLabelText('back-button'));

    expect(onPressFn).toHaveBeenCalledTimes(1);
  });
});
