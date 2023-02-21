import useFollowing from 'hooks/relationships/useFollowing';

/**
 * Hook that allows to get all the addresses of the users that the current application
 * user is following.
 */
const useFollowingAddresses = () => {
  const { following } = useFollowing();
  return following.map(user => user.address);
};

export default useFollowingAddresses;
