import React from 'react';
import {render} from 'jest/utils/CustomRender';
import TextCounter from 'components/TextCounter/index';

describe('component: TextCounter', () => {
  it('renders', () => {
    const tree = render(
      <TextCounter maxChar={100} textToCount="hello world" />,
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders maxChar reached', () => {
    const tree = render(
      <TextCounter
        maxChar={'hello world'.length - 1}
        textToCount="hello world"
      />,
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
