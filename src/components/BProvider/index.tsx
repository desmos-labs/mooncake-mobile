import { ApolloProvider } from '@apollo/client';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { NavigationContainer } from '@react-navigation/native';
import butterFonts from 'config/ButterFonts';
import lightTheme from 'config/theme/LightTheme';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { NativeBaseProvider } from 'native-base';
import RootNavigator from 'navigation/RootNavigator';
import React, { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import useClient from 'services/graphql/useClient';

// Keep the splash screen visible while we fetch resources
// Prevent native splash screen from auto-hiding before App component declaration
SplashScreen.preventAutoHideAsync().catch(console.warn); // it's good to explicitly catch and inspect any error

const BProvider = () => {
  const [isUiReady, setIsUiReady] = useState(false);
  const client = useClient();
  const styles = useStyles();

  // Effect to initialize the UI.
  useEffect(() => {
    (async () => {
      try {
        await Font.loadAsync(butterFonts);
      } catch (e) {
        console.warn(e);
      } finally {
        setIsUiReady(true);
      }
    })();
  }, []);

  // Effect to hide the splash screen once the app is ready.
  useEffect(() => {
    if (isUiReady) {
      SplashScreen.hideAsync();
    }
  }, [isUiReady]);

  if (!isUiReady) {
    return null;
  }

  return (
    <ApolloProvider client={client}>
      <NativeBaseProvider theme={lightTheme}>
        <GestureHandlerRootView style={styles.root}>
          <NavigationContainer>
            <BottomSheetModalProvider>
              <RootNavigator />
            </BottomSheetModalProvider>
          </NavigationContainer>
        </GestureHandlerRootView>
      </NativeBaseProvider>
    </ApolloProvider>
  );
};

const useStyles = () => {
  return {
    root: {
      flex: 1,
    },
  };
};

export default BProvider;
