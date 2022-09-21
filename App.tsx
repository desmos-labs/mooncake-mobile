import {ApolloProvider} from '@apollo/client';
import {NavigationContainer} from '@react-navigation/native';
import CustomToast from 'components/CustomSnackbarGroup/components/CustomToast';
import LightTheme from 'config/theme/LightTheme';
import RootNavigator from 'navigation/RootNavigator';
import React from 'react';
import {Provider as PaperProvider} from 'react-native-paper';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {ToastProvider} from 'react-native-toast-notifications';
import {RecoilRoot} from 'recoil';
import useApolloClient from 'services/graphql/useApolloClient';
import ToastConfig from 'config/ToastConfig';

const App = () => {
  const client = useApolloClient();
  return (
    <SafeAreaProvider>
      <PaperProvider theme={LightTheme}>
        <ToastProvider
          animationType="zoom-in"
          placement="top"
          offsetTop={30}
          duration={60000}
          renderType={{
            [ToastConfig.SUCCESS]: toast => (
              <CustomToast type="success" toast={toast} />
            ),
            [ToastConfig.ERROR]: toast => (
              <CustomToast type="failure" toast={toast} />
            ),
          }}>
          <ApolloProvider client={client}>
            <RecoilRoot>
              <NavigationContainer>
                <RootNavigator />
              </NavigationContainer>
            </RecoilRoot>
          </ApolloProvider>
        </ToastProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
};

export default App;
