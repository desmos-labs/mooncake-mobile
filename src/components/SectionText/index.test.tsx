import React from 'react';
import { render } from 'jest/utils/CustomWrappers';
import SectionText from 'components/SectionText/index';

describe('component: SectionText', () => {
  it('renders', () => {
    const tree = render(<SectionText leftText="left" rightText="right" />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
