import { useActiveAccountAddress } from '@recoil/accounts';
import { useHasFollowedUser } from '@recoil/relationships';

/**
 * Hook that allows to know if the current user is following a given user or not.
 */
const useIsFollowing = (counterparty: string) => {
  const activeAddress = useActiveAccountAddress();
  if (!activeAddress) {
    throw new Error(
      'Trying to know if the user is following another user, without an active account',
    );
  }

  const hasFollowedUser = useHasFollowedUser(activeAddress);

  // Do not perform the search if the active address and counterparty are the same
  return activeAddress !== counterparty && hasFollowedUser(counterparty);
};

export default useIsFollowing;
