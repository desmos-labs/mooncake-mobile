import {
  ApolloClient,
  ApolloLink,
  createHttpLink,
  InMemoryCache,
} from '@apollo/client';
import {MultiAPILink} from '@habx/apollo-multi-endpoint-link';
import EnvConfig from 'config/EnvConfig';

const endpoints = EnvConfig.GQL_ENDPOINT;

export const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: ApolloLink.from([
    new MultiAPILink({
      endpoints,
      httpSuffix: '/v1/graphql',
      createHttpLink,
    }),
  ]),
});

export default function useApolloClient() {
  return apolloClient;
}
