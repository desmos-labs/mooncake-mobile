import React from 'react';
import {render} from 'jest/utils/CustomWrappers';
import LoadingIndicator from './index';

describe('components: LoadingIndicator', () => {
  it('renders', () => {
    const tree = render(<LoadingIndicator />).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('stops animation if hideActiveDots is true', () => {
    const tree = render(
      <LoadingIndicator numDots={2} hideActiveDots />,
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
