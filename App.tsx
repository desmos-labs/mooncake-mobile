import {ApolloProvider} from '@apollo/client';
import {NavigationContainer} from '@react-navigation/native';
import CustomToast from 'components/CustomToast';
import LightTheme from 'config/theme/LightTheme';
import ToastConfig from 'config/ToastConfig';
import RootNavigator from 'navigation/RootNavigator';
import React from 'react';
import RNBootSplash from 'react-native-bootsplash';
import {Provider as PaperProvider} from 'react-native-paper';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {ToastProvider} from 'react-native-toast-notifications';
import {RecoilRoot} from 'recoil';
import client from 'services/graphql/client';

const App = () => {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={LightTheme}>
        <ToastProvider
          animationType="zoom-in"
          placement="top"
          offsetTop={30}
          duration={3000}
          renderType={{
            [ToastConfig.SUCCESS]: toast => (
              <CustomToast type={ToastConfig.SUCCESS} toast={toast} />
            ),
            [ToastConfig.ERROR]: toast => (
              <CustomToast type={ToastConfig.ERROR} toast={toast} />
            ),
            [ToastConfig.ERROR_NO_RETRY]: toast => (
              <CustomToast type={ToastConfig.ERROR_NO_RETRY} toast={toast} />
            ),
          }}>
          <ApolloProvider client={client}>
            <RecoilRoot>
              <NavigationContainer
                onReady={() => RNBootSplash.hide({fade: true})}>
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
