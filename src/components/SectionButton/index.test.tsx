import React from 'react';
import { render } from 'jest/utils/CustomWrappers';
import SectionButton from 'components/SectionButton/index';
import { desmosIcon } from 'assets/images';

describe('component: SectionButton', () => {
  it('renders', () => {
    const tree = render(<SectionButton label="label" />).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders left icon', () => {
    const tree = render(<SectionButton label="label" leftIcon={desmosIcon} />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
