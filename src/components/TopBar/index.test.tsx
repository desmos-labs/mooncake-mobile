import React from 'react';
import { render } from 'jest/utils/CustomWrappers';
import TopBar from 'components/TopBar/index';

const mockCanGoBack = jest.fn();

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: jest.fn(),
      canGoBack: mockCanGoBack,
    }),
  };
});

describe('component: TopBar', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders', () => {
    mockCanGoBack.mockReturnValue(false);
    const tree = render(<TopBar />).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders back button', () => {
    mockCanGoBack.mockReturnValue(true);
    const tree = render(<TopBar />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
