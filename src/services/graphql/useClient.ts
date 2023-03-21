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
      case 'profile':
        // @ts-ignore
        return `profile:${object.address}`;
      case 'user_relationship':
        // @ts-ignore
        return `user_relationship:${object.subspace_id}-${object.creator.address}-${object.counterparty.address}`;
      case 'reaction':
        // @ts-ignore
        if (object.post?.subspace_id && object.author?.address && object.post?.id && object.value) {
          // @ts-ignore
          // eslint-disable-next-line prettier/prettier
          return `reaction:${object.post.subspace_id}-${object.author.address}-${object.value.toString()}`;
        }
        return defaultDataIdFromObject(object);
      case 'notification':
        return `notification:${object.id}`;
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
