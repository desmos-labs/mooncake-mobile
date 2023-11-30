import { useSetAppStateValue } from '@recoil/appState';
import useInitializeAxios from 'hooks/axios/useInitializeAxios';
import useButterConfig from 'hooks/config/useButterConfig';
import useSubspaceParams from 'hooks/config/useSubspaceParams';
import usePostsParams from 'hooks/posts/usePostsParams';
import useProfileParams from 'hooks/profiles/useProfileParams';
import useSyncPendingTransactions from 'hooks/transactions/useSyncPendingTransactions';
import { useEffect } from 'react';
import * as RNLocalize from 'react-native-localize';

/**
 * Hook that allows initializing the application data.
 */
const useInitializeAppData = () => {
  // Data refreshers
  const { refetch: refreshButterConfig } = useButterConfig();
  const { refetch: refreshSubspaceParams } = useSubspaceParams();
  const { refetch: refreshProfileParams } = useProfileParams();
  const { refetch: refreshPostsParams } = usePostsParams();
  const syncPendingTransactions = useSyncPendingTransactions();

  // App state setters
  const setDataInitialized = useSetAppStateValue('dataInitialized');
  const setCurrentTimezone = useSetAppStateValue('currentTimezone');

  // Setup Axios
  useInitializeAxios();

  // Not the most elegant way, but it will do for now
  useEffect(() => {
    // Refresh the various params
    refreshButterConfig();
    refreshSubspaceParams();
    refreshProfileParams();
    refreshPostsParams();

    // Set the initial app state
    setDataInitialized(true);
    setCurrentTimezone(RNLocalize.getTimeZone());

    // Update the pending transactions
    syncPendingTransactions();
  }, [
    refreshButterConfig,
    refreshPostsParams,
    refreshProfileParams,
    refreshSubspaceParams,
    setCurrentTimezone,
    setDataInitialized,
    syncPendingTransactions,
  ]);
};

export default useInitializeAppData;
