import React from 'react';
import {render} from '@testing-library/react-native';
import FollowButton from 'components/FollowButton/index';

describe('component: FollowButton', () => {
  it('renders follow version', () => {
    const tree = render(<FollowButton type="follow" />).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders unfollow version', () => {
    const tree = render(<FollowButton type="unfollow" />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
