import React from 'react';
import {View, Text} from 'react-native';
import {storiesOf} from '@storybook/react-native';
import SbContainer from 'storybook/decorators/SbContainer';
import Spacer from 'components/Spacer/index';

storiesOf('components/Spacer', module)
  .addDecorator(getStories => (
    <SbContainer alignItems="center" justifyContent="center">
      {getStories()}
    </SbContainer>
  ))
  .add('Default', () => (
    <View>
      <Spacer paddingBottom={8}>
        <Text>This Text has a paddingBottom:8 spacer around it</Text>
      </Spacer>
      <Text>This Text does not have a spacer around it</Text>
      <Spacer paddingTop={8}>
        <Text>This Text has a paddingTop:8 spacer around it</Text>
      </Spacer>
    </View>
  ));
