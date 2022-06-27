import React from 'react';
import RootNavigator from 'navigation/RootNavigator';
import {Provider as PaperProvider} from 'react-native-paper';
import LightTheme from 'config/theme/LightTheme';
import {NavigationContainer} from '@react-navigation/native';

const App = () => {
  return (
    <PaperProvider theme={LightTheme}>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </PaperProvider>
  );
};

export default App;
