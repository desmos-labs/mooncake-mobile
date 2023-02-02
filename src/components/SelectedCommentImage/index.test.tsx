import React from 'react';
import { render } from 'jest/utils/CustomRender';
import SelectedCommentImage from 'components/SelectedCommentImage/index';
import { desmosIcon } from 'assets/images';

describe('component: SelectedCommentImage', () => {
  it('renders', () => {
    const tree = render(
      <SelectedCommentImage handlePress={jest.fn()} source={desmosIcon} />,
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders nothing if source is undefined', () => {
    const tree = render(
      <SelectedCommentImage handlePress={jest.fn()} source={undefined} />,
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
