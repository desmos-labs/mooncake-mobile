import React from 'react';
import { storiesOf } from '@storybook/react-native';
import SbContainer from 'storybook/decorators/SbContainer';
import { action } from '@storybook/addon-actions';
import { Text } from 'react-native';
import MaterialButton from './index';

type CompProps = React.ComponentProps<typeof MaterialButton>;

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

const GradientMode: CompProps = {
  ...TextMode,
  mode: 'gradient',
};

const GradientFilledMode: CompProps = {
  ...TextMode,
  mode: 'gradientFilled',
};

const BackgroundComponentMode: CompProps = {
  ...TextMode,
  mode: 'backgroundComponent',
};

// MaterialButton as in Desmos Button
storiesOf('components/MaterialButton', module)
  .addDecorator(getStories => (
    <SbContainer justifyContent="center" padding={16}>
      {getStories()}
    </SbContainer>
  ))
  .add('Text', () => (
    <MaterialButton {...TextMode}>
      <Text>Text Button</Text>
    </MaterialButton>
  ))
  .add('Outlined', () => (
    <MaterialButton {...OutlinedMode}>
      <Text>Outlined</Text>
    </MaterialButton>
  ))
  .add('Contained', () => (
    <MaterialButton {...ContainedMode}>
      <Text>Contained</Text>
    </MaterialButton>
  ))
  .add('Gradient', () => (
    <MaterialButton {...GradientMode}>
      <Text>Gradient</Text>
    </MaterialButton>
  ))
  .add('Gradient filled', () => (
    <MaterialButton {...GradientFilledMode}>
      <Text>Gradient filled</Text>
    </MaterialButton>
  ))
  .add('Background component', () => (
    <MaterialButton {...BackgroundComponentMode}>
      <Text>Gradient filled</Text>
    </MaterialButton>
  ))
  .add('Mixed', () => (
    <>
      <MaterialButton {...TextMode} style={{ marginBottom: 8 }}>
        <Text>Text Button</Text>
      </MaterialButton>
      <MaterialButton {...OutlinedMode} style={{ marginBottom: 8 }}>
        <Text>Outlined</Text>
      </MaterialButton>
      <MaterialButton {...ContainedMode} style={{ marginBottom: 8 }}>
        <Text>Contained</Text>
      </MaterialButton>
      <MaterialButton {...GradientMode} containerStyle={{ marginBottom: 8 }}>
        <Text>Gradient</Text>
      </MaterialButton>
      <MaterialButton {...GradientFilledMode} containerStyle={{ marginBottom: 8 }}>
        <Text>Gradient filled</Text>
      </MaterialButton>
    </>
  ));
