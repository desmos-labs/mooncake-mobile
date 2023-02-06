import React from 'react';
import {render} from 'jest/utils/CustomWrappers';
import RadialTextCounter from 'components/RadialTextCounter/index';

describe('component: RadialTextCounter', () => {
  it('renders', () => {
    const tree = render(<RadialTextCounter max={100} current={0} />).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('changes color if character count nears max', () => {
    const tree = render(<RadialTextCounter max={100} current={99} />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
