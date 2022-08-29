import React from 'react';
import SbContainer from 'storybook/decorators/SbContainer';
import {storiesOf} from '@storybook/react-native';
import EmptyFollowersComponent from './index';

storiesOf('components/EmptyFollowersComponent', module)
  .addDecorator(s => (
    <SbContainer justifyContent="center" alignItems="center">
      {s()}
    </SbContainer>
  ))
  .add('default', () => <EmptyFollowersComponent />);
