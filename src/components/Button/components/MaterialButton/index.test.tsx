import React from 'react';
import {render} from 'jest/utils/CustomWrappers';
import MaterialButton from 'components/Button/components/MaterialButton/index';

describe('component: MaterialButton', () => {
  it('renders', () => {
    const tree = render(<MaterialButton />).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders mode: text', () => {
    const tree = render(<MaterialButton mode="text" />).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders mode: backgroundComponent', () => {
    const tree = render(<MaterialButton mode="backgroundComponent" />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
