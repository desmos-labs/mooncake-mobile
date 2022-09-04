import {
  ApolloClient,
  ApolloLink,
  createHttpLink,
  InMemoryCache,
} from '@apollo/client';
import {MultiAPILink} from '@habx/apollo-multi-endpoint-link';
import {useMemo} from 'react';
import EnvConfig from 'config/EnvConfig';

export default function useApolloClient() {
  const endpoints = EnvConfig.GQL_ENDPOINT;

  return useMemo(
    () =>
      new ApolloClient({
        cache: new InMemoryCache(),
        link: ApolloLink.from([
          new MultiAPILink({
            endpoints,
            httpSuffix: '/v1/graphql',
            createHttpLink,
          }),
        ]),
      }),
    [endpoints],
  );
}
