import React from 'react';
import { render } from 'jest/utils/CustomRender';
import MnemonicWordBadge from 'components/MnemonicWordBadge/index';
import { fireEvent } from '@testing-library/react-native';

describe('component: MnemonicWordBard', () => {
  it('renders', () => {
    const tree = render(<MnemonicWordBadge value="hello" />).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('calls onPress with value as arguments', () => {
    const mockOnPress = jest.fn();

    const { getByText } = render(<MnemonicWordBadge value="hello" onPress={mockOnPress} />);

    fireEvent.press(getByText('hello'));

    expect(mockOnPress).toHaveBeenCalledWith('hello');
  });
});
