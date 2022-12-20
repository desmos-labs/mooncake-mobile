import React from 'react';
import {useChainLinks} from '@recoil/chainLinks';
import useActiveAccount from 'hooks/useActiveAccount';

/**
 * A hook that exposes a function that checks if a given address has an existing chainLink
 */
const useCheckIsAddressLinked = () => {
  const {activeAddress} = useActiveAccount();
  const {chainLinks} = useChainLinks(activeAddress!);

  const linkedAddresses = React.useMemo(() => {
    // O(1) vs O(n) (set vs array)
    return new Set([activeAddress, ...chainLinks.map(x => x.externalAddress)]);
  }, [chainLinks, activeAddress]);

  const checkIsAddressLinked = React.useCallback(
    (externalAddress: string) => {
      return linkedAddresses.has(externalAddress);
    },
    [linkedAddresses],
  );

  return {
    checkIsAddressLinked,
  };
};

export default useCheckIsAddressLinked;
