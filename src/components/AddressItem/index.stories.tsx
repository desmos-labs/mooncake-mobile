import React from 'react';
import { storiesOf } from '@storybook/react-native';
import SbContainer from 'storybook/decorators/SbContainer';
import { action } from '@storybook/addon-actions';
import AddressItem from './index';

storiesOf('components/AddressItem', module)
  .addDecorator(s => (
    <SbContainer padding={16} justifyContent="center">
      {s()}
    </SbContainer>
  ))
  .add('default', () => (
    <AddressItem
      index={0}
      address="cosmos14kajsd;afsdklafjdakl;fjdakl;de0trfkcd"
      handlePress={action('handlePress')}
    />
  ));
