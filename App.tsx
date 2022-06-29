import React from 'react';
import RootNavigator from 'navigation/RootNavigator';
import {Provider as PaperProvider} from 'react-native-paper';
import LightTheme from 'config/theme/LightTheme';
import {NavigationContainer} from '@react-navigation/native';
import {ApolloProvider} from '@apollo/client';
import useApolloClient from 'services/graphql/useApolloClient';
import {RecoilRoot} from 'recoil';

const App = () => {
  const client = useApolloClient();
  return (
    <PaperProvider theme={LightTheme}>
      <ApolloProvider client={client}>
        <RecoilRoot>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </RecoilRoot>
      </ApolloProvider>
    </PaperProvider>
  );
};

export default App;
