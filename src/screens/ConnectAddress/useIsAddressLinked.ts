import React from 'react';
import {useRecoilValue} from 'recoil';
import chainLinkState from '@recoil/chainLinks';
import useActiveAccount from 'hooks/useActiveAccount';

/**
 * A hook that exposes a function that checks if a given address has an existing chainLink
 */
const useCheckIfAddressLinked = () => {
  const {activeAddress} = useActiveAccount();
  const chainLinks = useRecoilValue(chainLinkState);

  const linkedAddresses = React.useMemo(() => {
    // O(1) vs O(n) (set vs array)
    return new Set([activeAddress, ...chainLinks.map(x => x.externalAddress)]);
  }, [chainLinks, activeAddress]);

  const checkIfAddressLinked = React.useCallback(
    (externalAddress: string) => {
      return linkedAddresses.has(externalAddress);
    },
    [linkedAddresses],
  );

  return {
    checkIfAddressLinked,
  };
};

export default useCheckIfAddressLinked;
