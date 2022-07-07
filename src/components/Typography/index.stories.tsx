import React from 'react';
import {storiesOf} from '@storybook/react-native';
import SbContainer from 'storybook/decorators/SbContainer';
import Typography from './index';

storiesOf('components/Typography', module)
  .addDecorator(getStories => (
    <SbContainer alignItems="center" justifyContent="space-evenly" padding={16}>
      {getStories()}
    </SbContainer>
  ))
  .add('Default', () => (
    <>
      <Typography.Body1>Body1</Typography.Body1>
      <Typography.Body2>Body2</Typography.Body2>
      <Typography.Caption1>Caption1</Typography.Caption1>
      <Typography.Caption2>Caption2</Typography.Caption2>
      <Typography.Display1>Display1</Typography.Display1>
      <Typography.Display2>Display2</Typography.Display2>
      <Typography.Subtitle1>Subtitle1</Typography.Subtitle1>
      <Typography.Subtitle2>Subtitle2</Typography.Subtitle2>
      <Typography.H1>H1</Typography.H1>
      <Typography.H2>H2</Typography.H2>
      <Typography.H4>H4</Typography.H4>
    </>
  ));
