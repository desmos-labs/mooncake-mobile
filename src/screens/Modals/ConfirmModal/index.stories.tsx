import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {action} from '@storybook/addon-actions';
import {storiesOf} from '@storybook/react-native';
import React from 'react';
import ConfirmModal, {
  ConfirmModalParams,
} from 'screens/Modals/ConfirmModal/index';
import SbContainer from 'storybook/decorators/SbContainer';

type StackParams = {
  ConfirmModal: ConfirmModalParams;
};

const Stack = createStackNavigator<StackParams>();

storiesOf('screens', module)
  .addDecorator(s => <SbContainer>{s()}</SbContainer>)
  .add('ConfirmModal', () => (
    <NavigationContainer independent>
      <Stack.Navigator>
        <Stack.Screen
          initialParams={{
            title: 'Title',
            subtitle: 'Subtitle',
            onPressPrimary: action('onPressPrimary'),
            onPressSecondary: action('onPressPrimary'),
            onDismiss: action('onDismiss'),
            primaryButtonLabel: 'PrimaryButtonLabel',
            secondaryButtonLabel: 'PrimaryButtonLabel',
          }}
          name="ConfirmModal"
          component={ConfirmModal}
        />
      </Stack.Navigator>
    </NavigationContainer>
  ));
