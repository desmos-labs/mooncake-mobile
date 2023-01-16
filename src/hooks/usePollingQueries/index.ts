/**
 * Queries that will poll at a constant interval to keep user data in sync
 */
import {useGetFollowingPolling} from '@recoil/following';

const usePollingQueries = () => {
  useGetFollowingPolling();
};

export default usePollingQueries;
