import BProvider from 'components/BProvider';
import EnvConfig from 'config/EnvConfig';
import { PostHogProvider } from 'posthog-react-native';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RecoilRoot } from 'recoil';
import * as Sentry from 'sentry-expo';

Sentry.init({
  dsn: EnvConfig.SENTRY_DSN,
  enableInExpoDevelopment: false,
  tracesSampleRate: 1.0,
});

export default function App() {
  return (
    <SafeAreaProvider>
      <RecoilRoot>
        <PostHogProvider
          apiKey={EnvConfig.POSTHOG_API_KEY}
          autocapture={false}
          options={{
            host: 'https://eu.posthog.com',
          }}>
          <BProvider />
        </PostHogProvider>
      </RecoilRoot>
    </SafeAreaProvider>
  );
}
