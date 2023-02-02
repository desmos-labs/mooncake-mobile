import React from 'react';
import { render } from 'jest/utils/CustomRender';
import GradientBorder from 'components/GradientBorder/index';

describe('component', () => {
  it('renders', () => {
    const tree = render(<GradientBorder />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
