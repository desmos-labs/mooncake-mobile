import React from 'react';
import {storiesOf} from '@storybook/react-native';
import SbContainer from 'storybook/decorators/SbContainer';
import DSecureTextInput from './index';

// DSecureTextInput as in Desmos SecureTextInput
storiesOf('components/DSecureTextInput', module)
  .addDecorator(getStories => (
    <SbContainer justifyContent="center" padding={16}>
      {getStories()}
    </SbContainer>
  ))
  .add('Default', () => <DSecureTextInput />);
