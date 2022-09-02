import {
  ApolloClient,
  ApolloLink,
  createHttpLink,
  InMemoryCache,
  FieldPolicy,
  StoreObject,
} from '@apollo/client';
import {MultiAPILink} from '@habx/apollo-multi-endpoint-link';
import {useMemo} from 'react';
import EnvConfig from 'config/EnvConfig';

/**
 * It merges the incoming data with the existing data in the cache, and it does so in a way that
 * respects the pagination variables
 * @returns A FieldPolicy object.
 */
function user_relationship() {
  const merge: FieldPolicy['merge'] = (
    existing: Array<StoreObject>,
    incoming: Array<StoreObject>,
    {readField, mergeObjects, field},
  ) => {
    /* This is to make sure that the
     merge function is only applied to the paginatedFollowers field. */
    if (field?.alias?.value !== 'paginatedFollowers') {
      /* Only cache the latest for when the field is not paginatedFollowers. */
      return incoming;
    }
    const merged = existing ? existing.slice(0) : [];
    const addressToIndex: Record<string, number> = Object.create(null);
    if (existing) {
      existing.forEach((item, index) => {
        const address = readField<string>(
          'address',
          readField<ProfileSummary>('_', item),
        );
        if (address) addressToIndex[address] = index;
      });
    }
    incoming.forEach(item => {
      const address =
        readField<string>('address', readField<ProfileSummary>('_', item)) ??
        '';
      const index = address ? addressToIndex[address] : undefined;
      if (typeof index === 'number') {
        merged[index] = mergeObjects(existing[index], item);
      } else {
        // First time we've seen this item in this array.
        if (address) addressToIndex[address] = merged.length;
        merged.push(item);
      }
    });
  };

  return {merge};
}

export default function useApolloClient() {
  const endpoints = EnvConfig.GQL_ENDPOINT;

  return useMemo(
    () =>
      new ApolloClient({
        cache: new InMemoryCache({
          typePolicies: {
            profile: {
              keyFields: ['address'],
            },
            Query: {
              fields: {
                user_relationship,
              },
            },
          },
        }),
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
