import React from 'react';
import {render} from 'jest/utils/CustomRender';
import SectionSwitch from 'components/SectionSwitch/index';

describe('component: SectionSwitch', () => {
  it('renders', () => {
    const tree = render(
      <SectionSwitch label="label" value onValueChange={jest.fn()} />,
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
