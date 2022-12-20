import {
  selectorFamily,
  useRecoilRefresher_UNSTABLE,
  useRecoilValueLoadable,
} from 'recoil';
import {ChainLink} from 'types/link';
import client from 'services/graphql/client';
import GetChainLinks from 'services/graphql/queries/GetChainLinks';

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
 * Recoil atom for the user's chain links
 */
const chainLinkState = selectorFamily<ChainLink[], string>({
  key: 'chainLink',
  get: (address: string) => async () => {
    const {data} = await client.query({
      query: GetChainLinks,
      variables: {
        address,
      },
    });

    const {chain_link} = data;

    return formatChainLink(chain_link);
  },
});

export const useChainLinks = (address: string) => {
  const chainLinksSelector = useRecoilValueLoadable<ChainLink[]>(
    chainLinkState(address),
  );

  const refetchChainLinks = useRecoilRefresher_UNSTABLE(
    chainLinkState(address),
  );

  const {state, contents} = chainLinksSelector;

  return {
    loading: state === 'loading',
    chainLinks: state === 'hasValue' ? contents : [],
    error: state === 'hasError' ? contents : undefined,
    refetch: refetchChainLinks,
  };
};

export default chainLinkState;
