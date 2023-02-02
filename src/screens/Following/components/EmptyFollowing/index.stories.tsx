import React from 'react';
import SbContainer from 'storybook/decorators/SbContainer';
import { storiesOf } from '@storybook/react-native';
import Empty from './index';

storiesOf('components/EmptyFollowing', module)
  .addDecorator(s => (
    <SbContainer justifyContent="center" alignItems="center">
      {s()}
    </SbContainer>
  ))
  .add('default', () => <Empty />);
