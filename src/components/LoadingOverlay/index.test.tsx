import React from 'react';
import { render } from 'jest/utils/CustomRender';
import LoadingOverlay from 'components/LoadingOverlay/index';

describe('component: LoadingOverlay', () => {
  it('renders', () => {
    const tree = render(<LoadingOverlay isVisible />).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('does not render if isVisible is false', () => {
    const tree = render(<LoadingOverlay isVisible={false} />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
