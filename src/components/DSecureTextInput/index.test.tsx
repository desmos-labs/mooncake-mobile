import React from 'react';
import {render} from 'jest/utils/CustomRender';
import DSecureTextInput from 'components/DSecureTextInput/index';
import {fireEvent} from '@testing-library/react-native';
import LightTheme from 'config/theme/LightTheme';

describe('component: DSecureTextInput', () => {
  it('renders', () => {
    const tree = render(<DSecureTextInput />).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('shows hidden values when eye button is pressed', () => {
    const {getByLabelText} = render(
      <DSecureTextInput accessibilityLabel="testInput" value="hello world" />,
    );
    fireEvent.press(getByLabelText('testInput-hidden'));

    expect(getByLabelText('testInput').props.secureEntry).toBeFalsy();
  });

  it('eye button changes depending if values are hidden or visible', () => {
    const {getByLabelText} = render(
      <DSecureTextInput accessibilityLabel="testInput" value="hello world" />,
    );

    expect(getByLabelText('testInput-hidden')).toBeTruthy();

    fireEvent.press(getByLabelText('testInput-hidden'));

    expect(getByLabelText('testInput-visible')).toBeTruthy();
  });

  it('calls on outerFocus when focused', () => {
    const mockOnOuterFocus = jest.fn();
    const {getByLabelText} = render(
      <DSecureTextInput
        onOuterFocus={mockOnOuterFocus}
        accessibilityLabel="testInput"
      />,
    );

    fireEvent(getByLabelText('testInput'), 'onFocus');

    expect(mockOnOuterFocus).toHaveBeenCalledTimes(1);
  });

  // This will test both the focused icon color as well as the onBlur function
  it('eye button iconColor changes depending on whether input is focused', () => {
    const {getByLabelText} = render(
      <DSecureTextInput accessibilityLabel="testInput" />,
    );

    fireEvent(getByLabelText('testInput'), 'onFocus');

    expect(
      // @ts-ignore
      getByLabelText('testInput-hidden').children[0].props.children.props.color,
    ).toBe(LightTheme.colors.surfaceBlack);

    fireEvent(getByLabelText('testInput'), 'onBlur');

    expect(
      // @ts-ignore
      getByLabelText('testInput-hidden').children[0].props.children.props.color,
    ).toBe(LightTheme.colors.iconGrey);
  });
});
