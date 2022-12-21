import {
  ApolloClient,
  ApolloLink,
  createHttpLink,
  InMemoryCache,
} from '@apollo/client';
import {setContext} from '@apollo/client/link/context';
import {MultiAPILink} from '@habx/apollo-multi-endpoint-link';
import EnvConfig from 'config/EnvConfig';
import {getMMKV, MMKVKEYS} from 'lib/MMKVStorage';

const multiApiLink = ApolloLink.from([
  new MultiAPILink({
    endpoints: EnvConfig.GQL_ENDPOINT,
    httpSuffix: '/v1/graphql',
    createHttpLink,
  }),
]);

const authLink = setContext((_, {headers}) => {
  const bearerToken = getMMKV(MMKVKEYS.REST_AUTH_TOKEN);
  console.log(bearerToken);
  return {
    headers: {
      ...headers,
      authorization: bearerToken ? `Bearer ${bearerToken}` : '',
    },
  };
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(multiApiLink),
});

export default client;
