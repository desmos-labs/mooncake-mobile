import React from 'react';
import { storiesOf } from '@storybook/react-native';
import SbContainer from 'storybook/decorators/SbContainer';
import ChainItem from 'screens/ImportAccountSelectChain/components/ChainItem/index';
import { desmosIcon } from 'assets/images';
import { action } from '@storybook/addon-actions';

storiesOf('components/ChainItem', module)
  .addDecorator(s => (
    <SbContainer padding={16} justifyContent="center">
      {s()}
    </SbContainer>
  ))
  .add('default', () => (
    <ChainItem
      chainName="Desmos Network"
      symbol="DSM"
      icon={desmosIcon}
      handlePress={action('handlePress')}
    />
  ));
