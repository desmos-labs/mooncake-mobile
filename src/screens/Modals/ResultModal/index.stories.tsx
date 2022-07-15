import React from 'react';
import {storiesOf} from '@storybook/react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {action} from '@storybook/addon-actions';
import {modalSuccess} from 'assets/images';
import ResultModal, {ResultModalParams} from 'screens/Modals/ResultModal/index';
import SbContainer from 'storybook/decorators/SbContainer';
import {NavigationContainer} from '@react-navigation/native';

type StackParams = {
  ResultModal: ResultModalParams;
};

const Stack = createStackNavigator<StackParams>();

storiesOf('screens', module)
  .addDecorator(s => <SbContainer>{s()}</SbContainer>)
  .add('ResultModal', () => (
    <NavigationContainer independent>
      <Stack.Navigator>
        <Stack.Screen
          initialParams={{
            title: 'Title',
            subtitle: 'Subtitle',
            image: modalSuccess,
            onPressPrimary: action('onPressPrimary'),
            onDismiss: action('onDismiss'),
            primaryButtonLabel: 'PrimaryButtonLabel',
          }}
          name="ResultModal"
          component={ResultModal}
        />
      </Stack.Navigator>
    </NavigationContainer>
  ));
