import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { storiesOf } from '@storybook/react-native';
import React from 'react';
import TextOnlyModal, { TextOnlyModalParams } from 'screens/Modals/TextOnlyModal/index';
import SbContainer from 'storybook/decorators/SbContainer';

type StackParams = {
  TextOnlyModal: TextOnlyModalParams;
};

const Stack = createStackNavigator<StackParams>();

storiesOf('screens', module)
  .addDecorator(s => <SbContainer>{s()}</SbContainer>)
  .add('TextOnlyModal', () => (
    <NavigationContainer independent>
      <Stack.Navigator>
        <Stack.Screen
          initialParams={{
            title: 'Title',
            body: 'Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups.Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups.',
          }}
          name="TextOnlyModal"
          component={TextOnlyModal}
        />
      </Stack.Navigator>
    </NavigationContainer>
  ));
