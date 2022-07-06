import React from 'react';

import {action} from '@storybook/addon-actions';
import {tipIcon} from 'assets/images';
import {storiesOf} from '@storybook/react-native';
import SbContainer from 'storybook/decorators/SbContainer';
import {View} from 'react-native';
import Typography from 'components/Typography';
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
    <View style={{alignItems: 'center'}}>
      <Typography.Body>Less than 1000</Typography.Body>
      <InteractionButton {...LessThan1000} />

      <Typography.Body style={{marginTop: 24}}>1000 - 999999</Typography.Body>
      <InteractionButton {...LessThan1000000} interactionCount={2560} />

      <InteractionButton {...LessThan1000000} />

      <Typography.Body style={{marginTop: 24}}>{'>1000000'}</Typography.Body>
      <InteractionButton {...If1000000AndMore} />
    </View>
  ));
