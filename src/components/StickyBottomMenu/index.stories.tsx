import {storiesOf} from '@storybook/react-native';
import Typography from 'components/Typography';
import React from 'react';
import {ScrollView} from 'react-native';
import SbContainer from 'storybook/decorators/SbContainer';
import StickyBottomMenu from './index';

const RenderComponent = () => {
  return (
    <>
      <ScrollView>
        <Typography.H1>Test</Typography.H1>
        <Typography.H1>Test</Typography.H1>
        <Typography.H1>Test</Typography.H1>
        <Typography.H1>Test</Typography.H1>
        <Typography.H1>Test</Typography.H1>
        <Typography.H1>Test</Typography.H1>
        <Typography.H1>Test</Typography.H1>
        <Typography.H1>Test</Typography.H1>
        <Typography.H1>Test</Typography.H1>
        <Typography.H1>Test</Typography.H1>
        <Typography.H1>Test</Typography.H1>
        <Typography.H1>Test</Typography.H1>
        <Typography.H1>Test</Typography.H1>
        <Typography.H1>Test</Typography.H1>
        <Typography.H1>Test</Typography.H1>
      </ScrollView>
      <StickyBottomMenu
        leftButtonAction={() => console.log('left')}
        middleButtonAction={() => console.log('middle')}
        rightButtonAction={() => console.log('right')}
      />
    </>
  );
};

storiesOf('components/StickyBottomMenu', module)
  .addDecorator(getStories => (
    <SbContainer justifyContent="center" padding={16}>
      {getStories()}
    </SbContainer>
  ))
  .add('Default', () => <RenderComponent />);
