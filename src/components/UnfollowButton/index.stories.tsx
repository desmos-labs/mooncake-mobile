import React from 'react';
import {storiesOf} from '@storybook/react-native';
import SbContainer from 'storybook/decorators/SbContainer';
import UnfollowButton from './index';

/* Creating a storybook story for the FollowButton component. */
storiesOf('components/UnfollowButton', module)
  .addDecorator(getStories => (
    <SbContainer justifyContent="center" padding={16}>
      {getStories()}
    </SbContainer>
  ))
  .add('Default', () => (
    <UnfollowButton subspaceID={4} creatorAddrees="" counterPartyAddress="" />
  ));
