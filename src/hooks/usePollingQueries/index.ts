/**
 * Queries that will poll at a constant interval to keep user data in sync
 */
import usePollLatestPostsByUser from '@recoil/latestPostsByUser';

const usePollingQueries = () => {
  usePollLatestPostsByUser(5);
};

export default usePollingQueries;
