import { ApolloProvider } from '@apollo/client';
import { NavigationContainer } from '@react-navigation/native';
import { NativeBaseProvider } from 'native-base';
import RootNavigator from 'navigation/RootNavigator';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RecoilRoot } from 'recoil';
import useClient from 'services/graphql/useClient';
import { ViewProps } from 'react-native';
import lightTheme from 'config/theme/LightTheme';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import CommonStyles from 'config/theme/CommonStyles';
import * as Sentry from 'sentry-expo';
import EnvConfig from 'config/EnvConfig';
import { PostHogProvider } from 'posthog-react-native';

Sentry.init({
  dsn: EnvConfig.SENTRY_DSN,
  enableInExpoDevelopment: false,
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

export default function App() {
  return (
    <GestureHandlerRootView style={CommonStyles.flex[1]}>
      <SafeAreaProvider>
        <RecoilRoot>
          <NativeBaseProvider theme={lightTheme}>
            <ButterApolloClientProvider>
              <NavigationContainer>
                <PostHogProvider apiKey={EnvConfig.POSTHOG_API_KEY} autocapture={false} options={{
                  host: 'https://eu.posthog.com'
                }} >
                  <RootNavigator />
                </PostHogProvider>
              </NavigationContainer>
            </ButterApolloClientProvider>
          </NativeBaseProvider>
        </RecoilRoot>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
