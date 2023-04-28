import React from 'react';
import useBlocked from 'hooks/relationships/blocked/useBlocked';

/**
 * Hook that allows to get all the addresses of the users that the current application
 * user is following.
 */
const useBlockedAddresses = () => {
  const { blocked } = useBlocked();
  return React.useMemo(() => blocked.map(user => user.address), [blocked]);
};

export default useBlockedAddresses;
