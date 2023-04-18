import { ApolloProvider } from '@apollo/client';
import { NavigationContainer } from '@react-navigation/native';
import { NativeBaseProvider } from 'native-base';
import RootNavigator from 'navigation/RootNavigator';
import React from 'react';
import RNBootSplash from 'react-native-bootsplash';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RecoilRoot } from 'recoil';
import useClient from 'services/graphql/useClient';
import { ViewProps } from 'react-native';
import lightTheme from 'config/theme/LightTheme';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import CommonStyles from 'config/theme/CommonStyles';

import * as Sentry from '@sentry/react-native';
import EnvConfig from 'config/EnvConfig';

Sentry.init({
  dsn: EnvConfig.SENTRY_DSN,
  tracesSampleRate: 1.0,
});

/**
 * Context provider that allows to properly instantiate an Apollo client that
 * reacts to app state changes such as chain change, auth token change and so on.
 * @constructor
 */
const ButterApolloClientProvider = (props: ViewProps) => {
  const { children } = props;
  const client = useClient();
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

function App(): JSX.Element {
  return (
    <GestureHandlerRootView style={CommonStyles.flex[1]}>
      <SafeAreaProvider>
        <RecoilRoot>
          <NativeBaseProvider theme={lightTheme}>
            <ButterApolloClientProvider>
              <NavigationContainer onReady={() => RNBootSplash.hide({ fade: true })}>
                <RootNavigator />
              </NavigationContainer>
            </ButterApolloClientProvider>
          </NativeBaseProvider>
        </RecoilRoot>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default Sentry.wrap(App);
