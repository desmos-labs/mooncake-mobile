import React from 'react';
import { render } from 'jest/utils/CustomWrappers';
import EnterCommentBottomBar from 'components/EnterCommentBottomBar/index';
import { defaultProfilePic } from 'assets/images';
import { act, fireEvent, waitFor } from '@testing-library/react-native';
import { Keyboard } from 'react-native';
import i18next from 'i18next';

jest.mock('@apollo/client', () => {
  const baseImplementation = jest.requireActual('@apollo/client');

  // Mock the response of GetPostsParams query
  const mockGetPostsParamsData = {
    params: [
      {
        params: {
          max_text_length: 500,
        },
      },
    ],
  };

  return {
    ...baseImplementation,
    __esModule: true,
    useQuery: jest.fn(() => ({
      data: mockGetPostsParamsData,
    })),
  };
});

describe('component: EnterCommentBottomBar', () => {
  it('renders', () => {
    const tree = render(
      <EnterCommentBottomBar onIconPress={jest.fn()} handlePostComment={jest.fn()} />,
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('shows media panel', () => {
    const { getByLabelText } = render(
      <EnterCommentBottomBar
        profileImage={defaultProfilePic}
        onIconPress={jest.fn()}
        focusTextInput={true}
        handlePostComment={jest.fn()}
      />,
    );

    act(() => {
      // @ts-ignore
      Keyboard._emitter.emit('keyboardWillShow');
    });

    expect(getByLabelText('use image from gallery')).toBeTruthy();
  });

  it('changes text', () => {
    const { getByText, getByPlaceholderText } = render(
      <EnterCommentBottomBar
        profileImage={defaultProfilePic}
        onIconPress={jest.fn()}
        focusTextInput={true}
        handlePostComment={jest.fn()}
      />,
    );

    const input = getByPlaceholderText(i18next.t('comment:write a comment'));

    act(() => {
      fireEvent.changeText(input, 'hello world');
    });

    waitFor(() => {
      expect(getByText('hello world')).toBeTruthy();
    });
  });
});
