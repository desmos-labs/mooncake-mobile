import { useActiveAccountAddress } from '@recoil/accounts';
import { useCachedIsFollowingUser } from '@recoil/followers';
import { DesmosProfile } from 'types/desmos';

/**
 * Hook that allows to know if the current user is following a given user or not.
 */
const useIsFollowing = (counterparty: DesmosProfile) => {
  const activeAddress = useActiveAccountAddress();
  return useCachedIsFollowingUser(activeAddress, counterparty);
};

export default useIsFollowing;
