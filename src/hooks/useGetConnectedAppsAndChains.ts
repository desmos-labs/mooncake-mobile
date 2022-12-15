import {useMemo, useCallback} from 'react';
import {useQuery} from '@apollo/client';
import GetConnectedAppsAndChains from 'services/graphql/queries/GetConnectedAppsAndChains';
import {MMKVKEYS, useMMKVStorage} from 'lib/MMKVStorage';
import {ChainLink} from 'types/link';
import {useSetRecoilState} from 'recoil';
import chainLinkState from '@recoil/chainLinks';
import {connectedAppsState} from '@recoil/connectedApps';

/**
 * Format incoming chainlink data from the server into a format that is easier to parse by the app.
 * @param {any[]} chainLinks - An array of chainlink data from the server.
 * @returns {ChainLink[]} - An array formatted of ChainLink objects
 */
const formatChainLink = (chainLinks: any[]) =>
  chainLinks.map(
    link =>
      ({
        chainName: link.chain_config.name,
        externalAddress: link.external_address,
        userAddress: link.user_address,
        creationTime: new Date(`${link.creation_time}Z`),
      } as ChainLink),
  );

/**
 * A hook that combines the fetching of a user's connected chains and applications.
 */
const useGetConnectedAppsAndChains = () => {
  const [activeAddress] = useMMKVStorage(MMKVKEYS.ACTIVE_ACCOUNT_ADDR);
  const setChainLinks = useSetRecoilState(chainLinkState);
  const setAppLinks = useSetRecoilState(connectedAppsState);

  const {data, refetch} = useQuery(GetConnectedAppsAndChains, {
    variables: {
      address: activeAddress,
    },
  });

  const formattedData = useMemo(() => {
    if (!data) return {chainLinks: [], appLinks: []};
    const {chain_link, application_link} = data;

    const formattedChainLinks = formatChainLink(chain_link);
    setChainLinks(formattedChainLinks);
    setAppLinks(application_link);
    return {
      chainLinks: formattedChainLinks,
      appLinks: application_link as ConnectedApps[],
    };
  }, [data]);

  const refetchData = useCallback(async () => {
    await refetch({address: activeAddress});
  }, [activeAddress]);

  return {
    ...formattedData,
    refetchData,
  };
};

export default useGetConnectedAppsAndChains;
