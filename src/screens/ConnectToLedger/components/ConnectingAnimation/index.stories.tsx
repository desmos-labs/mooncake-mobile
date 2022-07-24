import React from 'react';
import SbContainer from 'storybook/decorators/SbContainer';
import {storiesOf} from '@storybook/react-native';
import ConnectingAnimation from './index';

storiesOf('components/ConnectingAnimation', module)
  .addDecorator(s => (
    <SbContainer alignItems="center" justifyContent="center">
      {s()}
    </SbContainer>
  ))
  .add('default', () => <ConnectingAnimation />);
