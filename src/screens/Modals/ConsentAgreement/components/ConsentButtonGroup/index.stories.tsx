import React from 'react';
import SbContainer from 'storybook/decorators/SbContainer';
import ConsentButtonGroup from 'screens/Modals/ConsentAgreement/components/ConsentButtonGroup/index';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react-native';

storiesOf('components/ConsentButtonGroup', module)
  .addDecorator(s => (
    <SbContainer padding={16} justifyContent="center">
      {s()}
    </SbContainer>
  ))
  .add('default', () => (
    <ConsentButtonGroup
      handlePressTOS={action('handlePressTOS')}
      handlePressPP={action('handlePressPP')}
    />
  ));
