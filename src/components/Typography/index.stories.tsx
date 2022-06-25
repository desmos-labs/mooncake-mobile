import React from 'react';
import {storiesOf} from '@storybook/react-native';
import SbContainer from 'storybook/decorators/SbContainer';
import Typography from './index';

storiesOf('components/Typography', module)
  .addDecorator(getStories => (
    <SbContainer
      backgroundColor="gray"
      alignItems="center"
      justifyContent="space-evenly"
      padding={16}>
      {getStories()}
    </SbContainer>
  ))
  .add('Default', () => (
    <>
      <Typography.Body>Body</Typography.Body>
      <Typography.Body1>Body1</Typography.Body1>
      <Typography.Caption>Caption</Typography.Caption>
      <Typography.Caption2>Caption2</Typography.Caption2>
      <Typography.Title>Title</Typography.Title>
      <Typography.Subtitle>Subtitle</Typography.Subtitle>
      <Typography.Subtitle2>Subtitle2</Typography.Subtitle2>
      <Typography.H1>H1</Typography.H1>
      <Typography.H2>H2</Typography.H2>
      <Typography.H4>H4</Typography.H4>
    </>
  ));
