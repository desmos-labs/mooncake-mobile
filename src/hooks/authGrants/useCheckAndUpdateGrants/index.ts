import React from 'react';
import {GrantEnums} from 'lib/desmos/msgtypes';
import {useNavigation} from '@react-navigation/native';
import ROUTES from 'navigation/routes';
import useCheckGrants from 'hooks/authGrants/useCheckGrants';

/**
 * A Hook that checks and updates missing/expired grants. It will redirect
 * the user to the authorization popup and carry out the necessary steps (unlocking wallet, broadcast tx, etc)
 */
const useCheckAndUpdateGrants = () => {
  const {navigate, pop} = useNavigation<any>();
  const {checkGrants} = useCheckGrants();

  /**
   * Check and update a user's on-chain grants
   * @param {GrantEnums[]} Object.grantsToRequest - An Array of grants to request.
   * @param {string} Object.address - The address of the granter (i.e active address).
   * @param {boolean} Object.stayOnCurrentScreen - If true, will not call pop() after grant request process is completed.
   */
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
      // placeholder
      console.log(address);

      const missingOrExpiredGrants = await checkGrants(
        grantsToRequest,
        // address,
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
