import React from 'react';
import SbContainer from 'storybook/decorators/SbContainer';
import {storiesOf} from '@storybook/react-native';
import EmptyFollowingComponent from './index';

storiesOf('components/EmptyFollowingComponent', module)
  .addDecorator(s => (
    <SbContainer justifyContent="center" alignItems="center">
      {s()}
    </SbContainer>
  ))
  .add('default', () => <EmptyFollowingComponent />);
