import React from 'react';
import {render} from 'jest/utils/CustomRender';
import LedgerDeviceItem from './index';

describe('components: LedgerDeviceItem', () => {
  it('renders', () => {
    const tree = render(
      <LedgerDeviceItem name="test" onPress={jest.fn} />,
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
