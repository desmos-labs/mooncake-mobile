import {ApolloProvider} from '@apollo/client';
import {NavigationContainer} from '@react-navigation/native';
import LightTheme from 'config/theme/LightTheme';
import RootNavigator from 'navigation/RootNavigator';
import React from 'react';
import {Provider as PaperProvider} from 'react-native-paper';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {RecoilRoot} from 'recoil';
import useApolloClient from 'services/graphql/useApolloClient';

const App = () => {
  const client = useApolloClient();
  return (
    <SafeAreaProvider>
      <PaperProvider theme={LightTheme}>
        <ApolloProvider client={client}>
          <RecoilRoot>
            <NavigationContainer>
              <RootNavigator />
            </NavigationContainer>
          </RecoilRoot>
        </ApolloProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
};

export default App;
