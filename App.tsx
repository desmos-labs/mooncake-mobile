import React from 'react';
import RootNavigator from 'navigation/RootNavigator';
import {Provider as PaperProvider} from 'react-native-paper';
import LightTheme from 'config/theme/LightTheme';
import {NavigationContainer} from '@react-navigation/native';
import {ApolloProvider, useApolloClient} from '@apollo/client';

const App = () => {
  const client = useApolloClient();
  return (
    <PaperProvider theme={LightTheme}>
      <ApolloProvider client={client}>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </ApolloProvider>
    </PaperProvider>
  );
};

export default App;
