import {
  ApolloClient,
  ApolloLink,
  createHttpLink,
  InMemoryCache,
} from '@apollo/client';
import {MultiAPILink} from '@habx/apollo-multi-endpoint-link';
import EnvConfig from 'config/EnvConfig';

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: ApolloLink.from([
    new MultiAPILink({
      endpoints: EnvConfig.GQL_ENDPOINT,
      httpSuffix: '/v1/graphql',
      createHttpLink,
    }),
  ]),
});

export default client;
