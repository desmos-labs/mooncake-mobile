import Typography from '@desmoslabs/desmos-kit-ui/components/Typography';

import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react-native';
import { tipIcon } from 'assets/images';
import React from 'react';
import { View } from 'react-native';
import SbContainer from 'storybook/decorators/SbContainer';
import InteractionButton from './index';

type CompProps = React.ComponentProps<typeof InteractionButton>;

const LessThan1000: CompProps = {
  onPress: action('onPress'),

  interactionCount: 999,

  icon: tipIcon,
};

const LessThan1000000: CompProps = {
  ...LessThan1000,

  interactionCount: 950000,
};

const If1000000AndMore: CompProps = {
  ...LessThan1000,

  interactionCount: 1500000,
};

storiesOf('components/InteractionButton', module)
  .addDecorator(s => (
    <SbContainer justifyContent="center" alignItems="center">
      {s()}
    </SbContainer>
  ))
  .add('Default', () => (
    <View style={{ alignItems: 'center' }}>
      <Typography.Regular10>Less than 1000</Typography.Regular10>
      <InteractionButton {...LessThan1000} />
      <Typography.Regular10 style={{ marginTop: 24 }}>1000 - 999999</Typography.Regular10>
      <InteractionButton {...LessThan1000000} interactionCount={2560} />
      <InteractionButton {...LessThan1000000} />
      <Typography.Regular10 style={{ marginTop: 24 }}>{'>1000000'}</Typography.Regular10>
      <InteractionButton {...If1000000AndMore} />
    </View>
  ));
