import React from 'react';
import { render } from 'jest/utils/CustomWrappers';
import MediaBottomPanel from 'components/MediaBottomPanel/index';
import GetPostsParams from 'services/graphql/queries/GetPostsParams';
import { MockedProvider } from '@apollo/client/testing';

const mocks = [
  {
    request: {
      query: GetPostsParams,
    },
    result: {
      data: {
        params: {
          params: {
            max_text_length: 500,
          },
        },
      },
    },
  },
];

describe('component: MediaBottomPanel', () => {
  it('renders', () => {
    const tree = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MediaBottomPanel
          handlePressGallery={jest.fn()}
          handlePressCamera={jest.fn()}
          commentLength={0}
          imageSelected
        />
      </MockedProvider>,
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
