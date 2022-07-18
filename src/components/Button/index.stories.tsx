import React from 'react';
import {storiesOf} from '@storybook/react-native';
import SbContainer from 'storybook/decorators/SbContainer';
import {action} from '@storybook/addon-actions';
import {Text} from 'react-native';
import Button from './index';

type CompProps = React.ComponentProps<typeof Button>;

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

// MaterialButton as in Desmos Button
storiesOf('components/Button', module)
  .addDecorator(getStories => (
    <SbContainer justifyContent="center" padding={16}>
      {getStories()}
    </SbContainer>
  ))
  .add('Text', () => (
    <Button {...TextMode}>
      <Text>Text Button</Text>
    </Button>
  ))
  .add('Outlined', () => (
    <Button {...OutlinedMode}>
      <Text>Outlined</Text>
    </Button>
  ))
  .add('Contained', () => (
    <Button {...ContainedMode}>
      <Text>Contained</Text>
    </Button>
  ))
  .add('Gradient', () => (
    <Button {...GradientMode}>
      <Text>Gradient</Text>
    </Button>
  ))
  .add('Gradient filled', () => (
    <Button {...GradientFilledMode}>
      <Text>Gradient filled</Text>
    </Button>
  ))
  .add('Mixed', () => (
    <>
      <Button {...TextMode} style={{marginBottom: 8}}>
        <Text>Text Button</Text>
      </Button>
      <Button {...OutlinedMode} style={{marginBottom: 8}}>
        <Text>Outlined</Text>
      </Button>
      <Button {...ContainedMode} style={{marginBottom: 8}}>
        <Text>Contained</Text>
      </Button>
      <Button {...GradientMode} containerStyle={{marginBottom: 8}}>
        <Text>Gradient</Text>
      </Button>
      <Button {...GradientFilledMode} containerStyle={{marginBottom: 8}}>
        <Text>Gradient filled</Text>
      </Button>
    </>
  ));
