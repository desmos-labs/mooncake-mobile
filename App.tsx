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

const App = () => {
  const client = useApolloClient();
  return (
    <SafeAreaProvider>
      <ToastProvider
        animationType="zoom-in"
        placement="top"
        offsetTop={30}
        duration={60000}
        renderType={{
          butterSuccess: toast => <CustomToast type="success" toast={toast} />,
          butterFailure: toast => <CustomToast type="failure" toast={toast} />,
        }}>
        <PaperProvider theme={LightTheme}>
          <ApolloProvider client={client}>
            <RecoilRoot>
              <NavigationContainer>
                <RootNavigator />
              </NavigationContainer>
            </RecoilRoot>
          </ApolloProvider>
        </PaperProvider>
      </ToastProvider>
    </SafeAreaProvider>
  );
};

export default App;
