/**
 * Queries that will poll at a constant interval to keep user data in sync
 */
import {useGetConnectedAppsPolling} from '@recoil/connectedApps';
import {useGetFollowingPolling} from '@recoil/following';
import usePollLatestPostsByUser from '@recoil/latestPostsByUser';

const usePollingQueries = () => {
  useGetFollowingPolling();
  useGetConnectedAppsPolling();
  usePollLatestPostsByUser(5);
};

export default usePollingQueries;
