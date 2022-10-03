import React from 'react';
import {render} from 'jest/utils/CustomRender';
import DTextInput from 'components/DTextInput/index';

describe('component: DTextInput', () => {
  it('renders', () => {
    const tree = render(<DTextInput />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
