import React from 'react';
import {render} from '@testing-library/react-native';
import {Text} from 'react-native';
import DView from '.';

describe('component: DView', () => {
  it('renders', () => {
    const tree = render(
      <DView>
        <Text>Hello world</Text>
      </DView>,
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
