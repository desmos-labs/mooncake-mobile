import React from 'react';
import {render} from 'jest/utils/CustomRender';
import Section from 'components/Section/index';

describe('component: Section', () => {
  it('renders', () => {
    const tree = render(<Section>Hello world</Section>).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
