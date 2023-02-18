import { DesmosProfile } from 'types/desmos';

/**
 * Hook that returns the list of the accounts that the user having the given address is following.
 * @param address {String  | undefined} - Address of the user for which to get the following list.
 * If this is `undefined`, the current application's user address will be used instead.
 * TODO: Implement this
 */
const useFollowing = (address?: string) => {
  return {
    following: [] as DesmosProfile[],
    loading: false,
    fetchMore: () => {},
    fetchingMore: false,
    refetch: () => {},
    refreshing: false,
  };
};

export default useFollowing;
