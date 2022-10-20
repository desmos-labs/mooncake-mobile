/**
 * Queries that will poll at a constant interval to keep user data in sync
 */
import {useGetConnectedAppsPolling} from '@recoil/connectedApps';
import {useGetFollowingPolling} from '@recoil/following';

const usePollingQueries = () => {
  useGetFollowingPolling();
  useGetConnectedAppsPolling();
};

export default usePollingQueries;
