import React from 'react';
import SbContainer from 'storybook/decorators/SbContainer';
import {storiesOf} from '@storybook/react-native';
import EmptyPostComponent from './index';

storiesOf('components/EmptyPostComponent', module)
  .addDecorator(s => (
    <SbContainer justifyContent="center" alignItems="center">
      {s()}
    </SbContainer>
  ))
  .add('default', () => <EmptyPostComponent />);
