import { useActiveAccountAddress } from '@recoil/accounts';
import { useAppStateValue } from '@recoil/appState';
import React from 'react';
import useFetchTourGuidesState from './useFetchTourGuidesState';

/**
 * Hook that updates the cached tours guide state if the user
 * is logged in.
 */
const useInitTourGuidesState = () => {
  const dataFetched = React.useRef(false);
  const activeAccountAddress = useActiveAccountAddress();
  const bearerToken = useAppStateValue('bearerToken');
  const fetchToutGuidesState = useFetchTourGuidesState();

  React.useEffect(() => {
    if (activeAccountAddress === undefined || bearerToken === undefined || bearerToken === '') {
      dataFetched.current = false;
      return;
    }
    if (!dataFetched.current) {
      fetchToutGuidesState().then(data => {
        if (__DEV__) {
          console.log('[TourGuide] initialized tour guides state', data);
        }
      });
      dataFetched.current = true;
    }
  }, [activeAccountAddress, bearerToken, fetchToutGuidesState]);
};

export default useInitTourGuidesState;
