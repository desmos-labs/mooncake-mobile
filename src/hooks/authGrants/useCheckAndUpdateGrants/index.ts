import React from 'react';
import {GrantEnums} from 'lib/desmos/msgtypes';
import {useNavigation} from '@react-navigation/native';
import ROUTES from 'navigation/routes';
import {checkGrants} from './utils';

/**
 * A Hook that checks and updates missing/expired grants. It will redirect
 * the user to the authorization popup and carry out the necessary steps (unlocking wallet, broadcast tx, etc)
 */
const useCheckAndUpdateGrants = () => {
  const {navigate, pop} = useNavigation<any>();

  const checkAndUpdateGrants = React.useCallback(
    async ({
      grantsToRequest,
      address,
      stayOnCurrentScreen,
    }: {
      grantsToRequest: GrantEnums[];
      onCancel?: () => void;
      address: string;
      stayOnCurrentScreen?: boolean;
    }): Promise<{success: boolean}> => {
      const missingOrExpiredGrants = await checkGrants(
        grantsToRequest,
        address,
      );

      return new Promise(resolve => {
        if (missingOrExpiredGrants.length === 0) {
          resolve({success: true});
        } else {
          navigate(ROUTES.ACTION_AUTHORIZATION, {
            grants: missingOrExpiredGrants,
            onApprove: () => {
              !stayOnCurrentScreen && pop();
              resolve({success: true});
            },
            onCancel: () => {
              !stayOnCurrentScreen && pop();
              resolve({success: false});
            },
          });
        }
      });
    },
    [],
  );
  return {
    checkAndUpdateGrants,
  };
};

export default useCheckAndUpdateGrants;
