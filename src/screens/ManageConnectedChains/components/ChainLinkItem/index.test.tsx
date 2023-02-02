import React from 'react';
import ChainLinkItem from 'screens/ManageConnectedChains/components/ChainLinkItem/index';
import { render } from 'jest/utils/CustomRender';
import { fireEvent } from '@testing-library/react-native';

describe('component: AppConnectedItem', () => {
  it('renders', () => {
    const t = render(
      <ChainLinkItem
        chainName="testmosis"
        address="test123123123"
        onPressDisconnect={jest.fn}
        showSnackBar={jest.fn}
      />,
    ).toJSON();

    expect(t).toMatchSnapshot();
  });

  it('calls showSnackbar from props when copy button is clicked', () => {
    const mockShowSnackBar = jest.fn();

    const { getByLabelText } = render(
      <ChainLinkItem
        chainName="testmosis"
        address="test123123123"
        onPressDisconnect={jest.fn}
        showSnackBar={mockShowSnackBar}
      />,
    );

    const button = getByLabelText('copy address button');

    fireEvent.press(button);

    expect(mockShowSnackBar).toHaveBeenCalledTimes(1);
  });
});
