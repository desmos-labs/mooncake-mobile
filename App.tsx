import { GiphySDK } from '@giphy/react-native-sdk';
import * as Sentry from '@sentry/react-native';
import BProvider from 'components/BProvider';
import EnvConfig from 'config/EnvConfig';
import { PostHogProvider } from 'posthog-react-native';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RecoilRoot } from 'recoil';
import { DefaultPosthogFeatureFlags } from 'types/appFeatureFlags';

Sentry.init({
  dsn: EnvConfig.SENTRY_DSN,
  debug: false,
  tracesSampleRate: 1.0,
  enabled: !__DEV__,
});

GiphySDK.configure({
  apiKey: EnvConfig.GIPHY_API_KEY,
});

export default function App() {
  return (
    <SafeAreaProvider>
      <RecoilRoot>
        <PostHogProvider
          apiKey={EnvConfig.POSTHOG_API_KEY}
          autocapture={false}
          options={{
            bootstrap: {
              featureFlags: DefaultPosthogFeatureFlags,
            },
            host: 'https://eu.posthog.com',
          }}>
          <BProvider />
        </PostHogProvider>
      </RecoilRoot>
    </SafeAreaProvider>
  );
}
