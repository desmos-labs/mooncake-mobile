import React from 'react';
import {render} from 'jest/utils/CustomRender';
import SectionButton from 'components/SectionButton/index';

describe('component: SectionButton', () => {
  it('renders', () => {
    const tree = render(<SectionButton label="label" />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
