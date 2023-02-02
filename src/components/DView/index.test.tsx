import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
import { desmosIcon } from 'assets/images';
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

  it('renders background prop', () => {
    const tree = render(
      <DView backgroundImage={desmosIcon}>
        <Text>Hello world</Text>
      </DView>,
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
