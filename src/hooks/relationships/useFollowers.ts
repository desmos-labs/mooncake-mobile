import { DesmosProfile } from 'types/desmos';

/**
 * Hook that returns the list of the accounts that are following the user having the given address.
 * @param address {String  | undefined} - Address of the user for which to get the followers list.
 * If this is `undefined`, the current application's user address will be used instead.
 * TODO: Implement this
 */
const useFollowers = (address?: string) => {
  return {
    followers: [] as DesmosProfile[],
    loading: false,
    fetchMore: () => {},
    fetchingMore: false,
    refetch: () => {},
    refreshing: false,
  };
};

export default useFollowers;
