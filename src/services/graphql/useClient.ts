import {
  ApolloClient,
  ApolloLink,
  createHttpLink,
  defaultDataIdFromObject,
  InMemoryCache,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { MultiAPILink } from '@habx/apollo-multi-endpoint-link';
import EnvConfig from 'config/EnvConfig';
import { WebSocketLink } from '@apollo/client/link/ws';
import NotificationMergePolicy from 'services/graphql/queries/typePolicies/notification';
import { useAppStateValue } from '@recoil/appState';

const multiApiLink = ApolloLink.from([
  new MultiAPILink({
    endpoints: EnvConfig.GQL_ENDPOINT as any,
    httpSuffix: '/v1/graphql',
    wsSuffix: '/v1/graphql',
    createHttpLink,
    createWsLink: uri =>
      new WebSocketLink({
        uri,
        options: {
          reconnect: true,
        },
      }),
  }),
]);

const cache = new InMemoryCache({
  typePolicies: {
    ...NotificationMergePolicy,
  },
  dataIdFromObject(object) {
    switch (object.__typename) {
      case 'post_attachment':
        // @ts-ignore
        return `post_attachment:${object.content.uri}`;
      case 'djuno_profile':
        // @ts-ignore
        return `djuno_profile:${object.address}`;
      case 'user_relationship':
        // @ts-ignore
        return `user_relationship:${object.content.counterparty_address}`;
      default:
        return defaultDataIdFromObject(object);
    }
  },
});

/**
 * Hook that returns the authenticated link to be used for GraphQL requests.
 */
const useAuthLink = () => {
  const authToken = useAppStateValue('bearerToken');
  return setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: authToken ? `Bearer ${authToken}` : '',
      },
    };
  });
};

/**
 * Hook that allows to get the GraphQL client to be used for various requests.
 */
const useClient = () => {
  const authLink = useAuthLink();
  return new ApolloClient({
    cache,
    link: authLink.concat(multiApiLink),
  });
};

export default useClient;
