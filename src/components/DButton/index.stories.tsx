import React from 'react';
import {storiesOf} from '@storybook/react-native';
import SbContainer from 'storybook/decorators/SbContainer';
import {action} from '@storybook/addon-actions';
import {Text} from 'react-native';
import DButton from './index';

type CompProps = React.ComponentProps<typeof DButton>;

const TextMode: CompProps = {
  onPress: action('onPress'),
  mode: 'text',
};

const OutlinedMode: CompProps = {
  ...TextMode,
  mode: 'outlined',
};

const ContainedMode: CompProps = {
  ...TextMode,
  mode: 'contained',
};

// DButton as in Desmos Button
storiesOf('components/DButton', module)
  .addDecorator(getStories => (
    <SbContainer justifyContent="center" padding={16}>
      {getStories()}
    </SbContainer>
  ))
  .add('Text', () => (
    <DButton {...TextMode}>
      <Text>Text Button</Text>
    </DButton>
  ))
  .add('Outlined', () => (
    <DButton {...OutlinedMode}>
      <Text>Outlined</Text>
    </DButton>
  ))
  .add('Contained', () => (
    <DButton {...ContainedMode}>
      <Text>Contained</Text>
    </DButton>
  ));
