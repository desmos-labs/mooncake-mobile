import React from 'react';
import { render } from 'jest/utils/CustomRender';
import FlatListSeparator from 'components/FlatListSeparator/index';

describe('component: FlatListSeparator', () => {
  it('renders', () => {
    const tree = render(<FlatListSeparator />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
