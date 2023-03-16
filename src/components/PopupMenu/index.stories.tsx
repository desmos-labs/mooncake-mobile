import { storiesOf } from '@storybook/react-native';
import React from 'react';
import { View } from 'react-native';
import SbContainer from 'storybook/decorators/SbContainer';
import { iconCrossBlack } from 'assets/images';
import PopupMenu from './index';

const RenderComponent = () => {
  return (
    <View>
      <PopupMenu
        menuItems={[
          {
            label: 'test1',
            onPress: () => console.log('test'),
            icon: iconCrossBlack,
          },
          {
            label: 'test1',
            onPress: () => console.log('test'),
            icon: iconCrossBlack,
          },
          {
            label: 'test1',
            onPress: () => console.log('test'),
            icon: iconCrossBlack,
          },
        ]}
      />
    </View>
  );
};

storiesOf('components/PopupMenu', module)
  .addDecorator(getStories => (
    <SbContainer justifyContent="center" padding={16}>
      {getStories()}
    </SbContainer>
  ))
  .add('Default', () => <RenderComponent />);
