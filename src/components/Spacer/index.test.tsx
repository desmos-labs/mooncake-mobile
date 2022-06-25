import React from 'react';
import {render} from '@testing-library/react-native';
import Spacer from './index';

describe('component: Spacer', () => {
  it('renders', () => {
    const tree = render(
      <Spacer
        paddingTop={8}
        paddingBottom={8}
        paddingLeft={8}
        paddingRight={8}
      />,
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
