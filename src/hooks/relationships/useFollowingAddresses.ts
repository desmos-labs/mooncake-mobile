import useFollowing from 'hooks/relationships/useFollowing';
import React from 'react';

/**
 * Hook that allows to get all the addresses of the users that the current application
 * user is following.
 */
const useFollowingAddresses = () => {
  const { data: following } = useFollowing();
  return React.useMemo(() => following.map(user => user.address), [following]);
};

export default useFollowingAddresses;
