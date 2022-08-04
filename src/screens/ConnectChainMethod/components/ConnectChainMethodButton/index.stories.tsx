import React from 'react';
import {storiesOf} from '@storybook/react-native';
import SbContainer from 'storybook/decorators/SbContainer';
import ConnectChainMethodButton from 'screens/ConnectChainMethod/components/ConnectChainMethodButton/index';
import {action} from '@storybook/addon-actions';
import Spacer from 'components/Spacer';

storiesOf('components/ConnectChainMethodButton', module)
  .addDecorator(s => (
    <SbContainer padding={16} justifyContent="center">
      {s()}
    </SbContainer>
  ))
  .add('default', () => (
    <>
      <ConnectChainMethodButton
        method="ledger"
        handlePress={action('handlePress')}
      />
      <Spacer paddingVertical={16} />

      <ConnectChainMethodButton
        method="password"
        handlePress={action('handlePress')}
      />
    </>
  ));
