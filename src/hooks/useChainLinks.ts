import {ChainLink} from 'types/link';
import {useQuery} from '@apollo/client';
import {useRecoilState} from 'recoil';
import GetChainLinkByAddressDocument from 'services/graphql/queries/GetChainLinkAddressDocument';
import useActiveAccount from 'hooks/useActiveAccount';
import EnvConfig from 'config/EnvConfig';
import chainLinkState from '../recoil/chainLinks';

export default function useChainLinks() {
  const [chainLinks, setChainLinks] = useRecoilState(chainLinkState);

  const {activeAddress} = useActiveAccount();

  const {refetch} = useQuery(GetChainLinkByAddressDocument, {
    variables: {address: activeAddress},
    onCompleted: ({chain_link}) => {
      const cLinks = chain_link.map(
        (link: any) =>
          ({
            chainName: link.chain_config.name,
            externalAddress: link.external_address,
            userAddress: link.user_address,
            creationTime: new Date(`${link.creation_time}Z`),
          } as ChainLink),
      );

      setChainLinks(cLinks);
    },
    onError: () => {},
    pollInterval: EnvConfig.POLLING_INTERVAL,
  });

  return {
    chainLinks,
    refetch,
  };
}
