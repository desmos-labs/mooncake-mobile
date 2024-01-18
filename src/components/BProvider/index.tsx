import { ApolloProvider } from '@apollo/client';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { NavigationContainer } from '@react-navigation/native';
import { useSetUriAction } from '@recoil/uriAction';
import butterFonts from 'config/ButterFonts';
import lightTheme from 'config/theme/LightTheme';
import toastConfig from 'config/toast/toastConfig';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import useFetchAppFeatureFlags from 'hooks/featureflags/useFetchAppFeatureFlags';
import { getCachedUriAction, isUriActionPending, onCachedUriActionChange } from 'lib/BranchUtils';
import { NativeBaseProvider } from 'native-base';
import RootNavigator from 'navigation/RootNavigator';
import React, { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import useClient from 'services/graphql/useClient';

// Keep the splash screen visible while we fetch resources
// Prevent native splash screen from auto-hiding before App component declaration
SplashScreen.preventAutoHideAsync().catch(console.warn); // it's good to explicitly catch and inspect any error

const BProvider = () => {
  const [isUiReady, setIsUiReady] = useState(false);
  const [areFeatureFlagsReady, setAreFeatureFlagsReady] = useState(false);
  const client = useClient();
  const styles = useStyles();
  const insets = useSafeAreaInsets();
  const fetchFeatureFlags = useFetchAppFeatureFlags();
  const setUriAction = useSetUriAction();

  // Effect to initialize the feature flags.
  useEffect(() => {
    fetchFeatureFlags()
      .then(ready => setAreFeatureFlagsReady(ready))
      .catch(err => {
        console.warn(err);
        setAreFeatureFlagsReady(true);
      });
  }, [fetchFeatureFlags]);

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
    if (isUiReady && areFeatureFlagsReady) {
      SplashScreen.hideAsync();
    }
  }, [areFeatureFlagsReady, isUiReady]);

  // Effect to update the uri action stored in the recoil.
  useEffect(() => {
    if (isUriActionPending()) {
      setUriAction(getCachedUriAction());
    }
    return onCachedUriActionChange(() => {
      const action = getCachedUriAction();
      if (action !== undefined) {
        console.log('uri action cache changed', action);
        setUriAction(action);
      }
    });
  }, [setUriAction]);

  if (!isUiReady || !areFeatureFlagsReady) {
    return null;
  }

  return (
    <ApolloProvider client={client}>
      <GestureHandlerRootView style={styles.root}>
        <NativeBaseProvider theme={lightTheme}>
          <NavigationContainer>
            <BottomSheetModalProvider>
              <RootNavigator />
            </BottomSheetModalProvider>
          </NavigationContainer>
          <Toast config={toastConfig} topOffset={insets.top || 60} visibilityTime={50000} />
        </NativeBaseProvider>
      </GestureHandlerRootView>
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
