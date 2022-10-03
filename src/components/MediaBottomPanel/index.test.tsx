import React from 'react';
import {render} from 'jest/utils/CustomRender';
import MediaBottomPanel from 'components/MediaBottomPanel/index';

describe('component: MediaBottomPanel', () => {
  it('renders', () => {
    const tree = render(
      <MediaBottomPanel
        handlePressGallery={jest.fn()}
        handlePressCamera={jest.fn()}
        handlePressMention={jest.fn()}
        commentLength={0}
        imageSelected
      />,
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
