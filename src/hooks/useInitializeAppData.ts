import { useSetAppStateValue } from '@recoil/appState';
import useRefreshSession from 'hooks/apis/useRefreshSession';
import useInitializeAxios from 'hooks/axios/useInitializeAxios';
import useSubspaceParams from 'hooks/config/useSubspaceParams';
import usePostsParams from 'hooks/posts/usePostsParams';
import useProfileParams from 'hooks/profiles/useProfileParams';
import { useEffect } from 'react';
import * as RNLocalize from 'react-native-localize';
import useInitTaskContext from 'hooks/tasks/useInitTaskContext';
import useSetUserLanguage from 'hooks/user/useSetUserLanguage';
import useRefreshAccountInfo from 'hooks/apis/useRefreshAccountInfo';

/**
 * Hook that allows initializing the application data.
 */
const useInitializeAppData = () => {
  // Data refreshers
  const { refetch: refreshSubspaceParams } = useSubspaceParams();
  const { refetch: refreshProfileParams } = useProfileParams();
  const { refetch: refreshPostsParams } = usePostsParams();
  const refreshSession = useRefreshSession();
  const setUserLanguage = useSetUserLanguage();
  const refreshAccountInfo = useRefreshAccountInfo();

  // App state setters
  const setDataInitialized = useSetAppStateValue('dataInitialized');
  const setCurrentTimezone = useSetAppStateValue('currentTimezone');

  // Setup Axios
  useInitializeAxios();

  // Init the background task context.
  useInitTaskContext();

  // Not the most elegant way, but it will do for now
  useEffect(() => {
    refreshSession().catch(error => {
      console.log('Error while refreshing session:', error);
    });
    refreshAccountInfo().catch(error => {
      console.log('Error while refreshing account info', error);
    });
    setUserLanguage().catch(error => {
      console.log('Error while setting user language', error);
    });

    // Refresh the various params
    refreshSubspaceParams();
    refreshProfileParams();
    refreshPostsParams();

    // Set the initial app state
    setDataInitialized(true);
    setCurrentTimezone(RNLocalize.getTimeZone());
  }, [
    refreshAccountInfo,
    refreshPostsParams,
    refreshProfileParams,
    refreshSession,
    refreshSubspaceParams,
    setCurrentTimezone,
    setDataInitialized,
    setUserLanguage,
  ]);
};

export default useInitializeAppData;
