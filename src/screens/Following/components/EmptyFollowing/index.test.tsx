import React from 'react';
import { render } from 'jest/utils/CustomRender';
import Empty from './index';

describe('component: EmptyFollowing', () => {
  it('renders', () => {
    const tree = render(<Empty />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
