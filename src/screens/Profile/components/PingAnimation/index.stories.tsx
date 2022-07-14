import React from 'react';
import {storiesOf} from '@storybook/react-native';
import SbContainer from 'storybook/decorators/SbContainer';
import PingAnimation from 'screens/Profile/components/PingAnimation/index';

storiesOf('components/PingAnimation', module)
  .addDecorator(s => (
    <SbContainer alignItems="center" justifyContent="center">
      {s()}
    </SbContainer>
  ))
  .add('default', () => <PingAnimation size={15} color="red" />);
