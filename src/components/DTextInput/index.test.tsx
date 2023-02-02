import React from 'react';
import { render } from 'jest/utils/CustomRender';
import DTextInput from 'components/DTextInput/index';

describe('component: DTextInput', () => {
  it('renders', () => {
    const tree = render(<DTextInput />).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders error style', () => {
    const tree = render(<DTextInput error />).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders numberOfLines style', () => {
    const tree = render(<DTextInput numberOfLines={1} />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
