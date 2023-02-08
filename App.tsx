import { ApolloProvider } from '@apollo/client';
import { NavigationContainer } from '@react-navigation/native';
import CustomToast from 'components/CustomToast';
import LightTheme from 'config/theme/LightTheme';
import ToastConfig from 'config/ToastConfig';
import RootNavigator from 'navigation/RootNavigator';
import React from 'react';
import RNBootSplash from 'react-native-bootsplash';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ToastProvider } from 'react-native-toast-notifications';
import { RecoilRoot } from 'recoil';
import useClient from 'services/graphql/useClient';
import { ViewProps } from 'react-native';

/**
 * Provider that allows to easily get the context allowing to show
 * custom toasts if needed.
 * @constructor
 */
const ButterToastProvider = (props: ViewProps) => {
  const { children } = props;
  return (
    <ToastProvider
      animationType="zoom-in"
      placement="top"
      offsetTop={30}
      duration={3000}
      renderType={{
        [ToastConfig.SUCCESS]: toast => <CustomToast type={ToastConfig.SUCCESS} toast={toast} />,
        [ToastConfig.ERROR]: toast => <CustomToast type={ToastConfig.ERROR} toast={toast} />,
        [ToastConfig.ERROR_NO_RETRY]: toast => (
          <CustomToast type={ToastConfig.ERROR_NO_RETRY} toast={toast} />
        ),
      }}>
      {children}
    </ToastProvider>
  );
};

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
    <SafeAreaProvider>
      <RecoilRoot>
        <PaperProvider theme={LightTheme}>
          <ButterToastProvider>
            <ButterApolloClientProvider>
              <NavigationContainer onReady={() => RNBootSplash.hide({ fade: true })}>
                <RootNavigator />
              </NavigationContainer>
            </ButterApolloClientProvider>
          </ButterToastProvider>
        </PaperProvider>
      </RecoilRoot>
    </SafeAreaProvider>
  );
}

export default App;
