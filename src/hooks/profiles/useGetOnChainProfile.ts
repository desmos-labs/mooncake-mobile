import useCustomLazyQuery from 'hooks/graphql/useCustomLazyQuery';
import { convertGraphQLProfile } from 'lib/GraphQLUtils';
import React from 'react';
import GetProfileDataForAddress from 'services/graphql/queries/GetProfileDataForAddress';
import { DesmosProfile } from 'types/desmos';

/**
 * Hook that provides a function to fetch the profile associated with an address.
 *
 * <b>NOTE:</b> The profile is fetched using a lazy query from the GraphQL endpoint. This means that if this function
 * is called before the Apollo Client is properly setup with the correct authentication token, the result will always
 * be `undefined` unless the query is called again after the client is properly setup <b>or</b> unless the server
 * allows for unauthenticated calls to the query. This because the client used by the lazy query is the one provided
 * during the setup of the query itself, instead of the execution of the query. If later on the context changes, the
 * lazy query will <b>not</b> be rebuilt and, instead, will still use the old one.
 * As a reference, see <a href="https://github.com/apollographql/apollo-client/issues/5912">here</a>.
 */
const useGetOnChainProfile = () => {
  const [getLazyData] = useCustomLazyQuery(GetProfileDataForAddress, {
    fetchPolicy: 'network-only',
  });

  return React.useCallback(
    async (address: string): Promise<DesmosProfile | undefined> => {
      const data = await getLazyData({
        variables: { address },
      });

      return data?.profiles?.length > 0 ? convertGraphQLProfile(data.profiles[0]) : undefined;
    },
    [getLazyData],
  );
};

export default useGetOnChainProfile;
