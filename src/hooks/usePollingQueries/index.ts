/**
 * Queries that will poll at a constant interval to keep user data in sync
 */
import {useGetFollowingPolling} from '@recoil/following';
// import usePollLatestPostsByUser from '@recoil/latestPostsByUser';

const usePollingQueries = () => {
  useGetFollowingPolling();
  // usePollLatestPostsByUser(5);
};

export default usePollingQueries;
