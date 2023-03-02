import React from 'react';
import { render } from 'jest/utils/CustomWrappers';
import DropShadowWrapper from 'components/DropShadowWrapper/index';

describe('component: DropShadowWrapper', () => {
  it('renders', () => {
    const tree = render(<DropShadowWrapper />).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders with disableInnerWrapper', () => {
    const tree = render(<DropShadowWrapper disableInnerWrapper />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
