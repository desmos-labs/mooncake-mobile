import { useSetAppStateValue } from '@recoil/appState';
import useRefreshSession from 'hooks/apis/useRefreshSession';
import useInitializeAxios from 'hooks/axios/useInitializeAxios';
import useButterConfig from 'hooks/config/useButterConfig';
import useSubspaceParams from 'hooks/config/useSubspaceParams';
import usePostsParams from 'hooks/posts/usePostsParams';
import useProfileParams from 'hooks/profiles/useProfileParams';
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
  const refreshSession = useRefreshSession();

  // App state setters
  const setDataInitialized = useSetAppStateValue('dataInitialized');
  const setCurrentTimezone = useSetAppStateValue('currentTimezone');

  // Setup Axios
  useInitializeAxios();

  // Not the most elegant way, but it will do for now
  useEffect(() => {
    refreshSession();
    // Refresh the various params
    refreshButterConfig();
    refreshSubspaceParams();
    refreshProfileParams();
    refreshPostsParams();

    // Set the initial app state
    setDataInitialized(true);
    setCurrentTimezone(RNLocalize.getTimeZone());
  }, [
    refreshButterConfig,
    refreshPostsParams,
    refreshProfileParams,
    refreshSession,
    refreshSubspaceParams,
    setCurrentTimezone,
    setDataInitialized,
  ]);
};

export default useInitializeAppData;
