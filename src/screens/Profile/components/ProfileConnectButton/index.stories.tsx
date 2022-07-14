import React from 'react';
import {storiesOf} from '@storybook/react-native';
import SbContainer from 'storybook/decorators/SbContainer';
import {action} from '@storybook/addon-actions';
import {View} from 'react-native';
import ProfileConnectButton from './index';

type CompProps = React.ComponentProps<typeof ProfileConnectButton>;

const defaultProps: CompProps = {
  label: 'Label',

  handlePress: action('handlePress'),
};

storiesOf('components/ProfileConnectButton', module)
  .addDecorator(s => (
    <SbContainer alignItems="center" justifyContent="center">
      {s()}
    </SbContainer>
  ))
  .add('default', () => (
    <View style={{flexDirection: 'row'}}>
      <ProfileConnectButton {...defaultProps} />
    </View>
  ));
