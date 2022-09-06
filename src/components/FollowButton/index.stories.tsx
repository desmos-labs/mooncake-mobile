import React from 'react';
import {storiesOf} from '@storybook/react-native';
import SbContainer from 'storybook/decorators/SbContainer';
import FollowButton from './index';

/* Creating a storybook story for the FollowButton component. */
storiesOf('components/FollowButton', module)
  .addDecorator(getStories => (
    <SbContainer justifyContent="center" padding={16}>
      {getStories()}
    </SbContainer>
  ))
  .add('Follow', () => <FollowButton type="follow" />)
  .add('Unfollow', () => <FollowButton type="unfollow" />);
