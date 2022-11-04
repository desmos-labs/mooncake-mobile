/**
 * Queries that will poll at a constant interval to keep user data in sync
 */
import {useGetConnectedAppsPolling} from '@recoil/connectedApps';
import {useGetFollowingPolling} from '@recoil/following';
import usePollLatestPostsByUser from '@recoil/latestPostsByUser';
import {PendingPostEnum} from '@recoil/pendingTx/pendingPosts';

const usePollingQueries = () => {
  useGetFollowingPolling();
  useGetConnectedAppsPolling();
  usePollLatestPostsByUser(5, PendingPostEnum.POST);
};

export default usePollingQueries;
