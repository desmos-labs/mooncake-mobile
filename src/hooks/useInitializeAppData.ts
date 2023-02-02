import { useEffect } from 'react';
import * as RNLocalize from 'react-native-localize';
import { useInitializeAxios } from 'services/axios';
import useButterConfig from 'hooks/useButterConfig';
import useProfileParams from 'hooks/useProfileParams';
import usePostsParams from 'hooks/usePostsParams';
import useSubspaceParams from 'hooks/useSubspaceParams';
import { useSetAppStateValue } from '@recoil/appState';

/**
 * Hook that allows initializing the application data.
 */
const useInitializeAppData = () => {
  // Data refreshers
  const { refetch: refreshButterConfig } = useButterConfig();
  const { refetch: refreshSubspaceParams } = useSubspaceParams();
  const { refetch: refreshProfileParams } = useProfileParams();
  const { refetch: refreshPostsParams } = usePostsParams();

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

    // TODO: See if these made sense
    // const resolveOutstandingOptimisticRelationships = async () => {
    //   await updateFollowing();
    //   await resolveOptimisticRelationships();
    // };
    // resolveOutstandingOptimisticRelationships();
  }, []);
};

export default useInitializeAppData;
