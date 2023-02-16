import { useLazyQuery } from '@apollo/client';
import React, { useMemo, useState } from 'react';
import { useActiveAccountAddress } from '@recoil/accounts';
import { ApplicationLink } from 'types/desmos';
import { convertGraphQLApplicationLink } from 'lib/GraphQLUtils';
import { useStoredApplicationLinks, useStoreUserApplicationLinks } from '@recoil/applicationLinks';
import GetAccountApplicationLinks from 'services/graphql/queries/GetAccountApplicationLinks';

/**
 * Hook to retrieve the chain links for a user having a given address.
 * @param address {string} - Address of the user for which to get the chain links.
 */
const useAppLinksGivenAddress = (address?: string | undefined) => {
  const activeAccountAddress = useActiveAccountAddress()!;
  const userAddress = address || activeAccountAddress;
  const isForActiveUser = activeAccountAddress === userAddress;

  const [fetchedAppLinks, setFetchedAppLinks] = useState<ApplicationLink[]>([]);

  const storeUserApplicationLinks = useStoreUserApplicationLinks();
  const storedApplicationLinks = useStoredApplicationLinks();

  const userChainLinks = useMemo(
    // If the user we're getting the chains links for is the active user, get the cached ones.
    // Otherwise, get the ones that will be downloaded from the server
    () => (isForActiveUser ? storedApplicationLinks[userAddress] || [] : fetchedAppLinks),
    [isForActiveUser, fetchedAppLinks, storedApplicationLinks, userAddress],
  );

  const [, { loading, refetch }] = useLazyQuery(GetAccountApplicationLinks, {
    variables: { address: userAddress },
    fetchPolicy: 'no-cache',
  });

  const fetchChainLinks = React.useCallback(async () => {
    if (!userAddress) {
      return;
    }

    const { data } = await refetch({ address: userAddress });
    if (!data) {
      return;
    }

    const { applicationLinks: appLinks } = data;
    const retrievedApplicationLink = appLinks.map(convertGraphQLApplicationLink);

    switch (isForActiveUser) {
      case true:
        // Cache the chain links of the active user
        storeUserApplicationLinks(userAddress, retrievedApplicationLink, false);
        break;

      default:
        // Set the fetched chain links if the queried user is not the active one
        setFetchedAppLinks(retrievedApplicationLink);
    }
  }, [userAddress, refetch, isForActiveUser, storeUserApplicationLinks]);

  return {
    appLinks: userChainLinks,
    loading,
    refetch: fetchChainLinks,
  };
};

export default useAppLinksGivenAddress;
