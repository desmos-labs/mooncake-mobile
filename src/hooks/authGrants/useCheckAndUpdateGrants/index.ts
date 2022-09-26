import React from 'react';
import {GrantEnums} from 'lib/desmos/msgtypes';
import {useNavigation} from '@react-navigation/native';
import ROUTES from 'navigation/routes';
import {checkGrants} from './utils';

const useCheckAndUpdateGrants = () => {
  const {navigate, pop} = useNavigation<any>();

  const checkAndUpdateGrants = React.useCallback(
    async ({
      grantsToRequest,
      address,
    }: {
      grantsToRequest: GrantEnums[];
      onCancel?: () => void;
      address: string;
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
              pop();
              resolve({success: true});
            },
            onCancel: () => {
              pop();
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
