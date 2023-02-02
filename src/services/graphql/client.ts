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
import { getMMKV, MMKVKEYS } from 'lib/MMKVStorage';
import { WebSocketLink } from '@apollo/client/link/ws';
import NotificationMergePolicy from 'services/graphql/queries/typePolicies/notification';

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
const authLink = setContext((_, { headers }) => {
  const bearerToken = getMMKV(MMKVKEYS.REST_AUTH_TOKEN);
  return {
    headers: {
      ...headers,
      authorization: bearerToken ? `Bearer ${bearerToken}` : '',
    },
  };
});

const client = new ApolloClient({
  cache,
  link: authLink.concat(multiApiLink),
});

export default client;
