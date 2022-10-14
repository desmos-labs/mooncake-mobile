import React from 'react';
import {GrantEnums} from 'lib/desmos/msgtypes';
import {useNavigation} from '@react-navigation/native';
import ROUTES from 'navigation/routes';
import {differenceInMilliseconds} from 'date-fns';
import {MMKVKEYS, useMMKVStorage} from 'lib/MMKVStorage';
import {useGetAuthzGrants} from 'services/graphql/queries/GetAuthGrants';

/*
 * @typedef CheckAndUpdateGrantsArgs
 * @param {GrantEnums[]} Object.grantsToRequest - An Array of grants to request.
 * @param {string} Object.address - The address of the granter (i.e active address).
 * @param {boolean} Object.stayOnCurrentScreen - If true, will not call pop() after grant request process is completed.
 */
export interface CheckAndUpdateGrantsArgs {
  grantsToRequest: GrantEnums[];
  address: string;
  stayOnCurrentScreen?: boolean;
}

/**
 * A Hook that checks and updates missing/expired grants. It will redirect
 * the user to the authorization popup and carry out the necessary steps (unlocking wallet, broadcast tx, etc)
 */
const useCheckAndUpdateGrants = () => {
  const {navigate, pop} = useNavigation<any>();
  const {getAuthzGrants} = useGetAuthzGrants();
  const [activeAddr] = useMMKVStorage<string>(MMKVKEYS.ACTIVE_ACCOUNT_ADDR);

  /**
   * Convenience function to check if the user has enabled a grant for a given list
   * @param {GrantEnums[]} grantsToCheck - check if user has provided grants for these grants
   * @return {GrantEnums[]} - an empty array or subset of grantsToCheck that have not yet been granted
   */
  const checkGrants = React.useCallback(
    async (grantsToCheck: GrantEnums[]): Promise<GrantEnums[]> => {
      if (!activeAddr) throw new Error('[checkGrant]: No active address found');

      const grantsResponse = await getAuthzGrants();

      console.log(JSON.stringify(grantsResponse));

      const grants: {
        [index: string]: {msg_type: GrantEnums; expiration: string};
      } = grantsResponse.grants.reduce((acc, cur) => {
        return {
          ...acc,
          [cur.msg_type]: cur,
        };
      }, {});

      return grantsToCheck.filter(x => {
        if (grants[x]) {
          const differenceFromNow = differenceInMilliseconds(
            Date.now(),
            new Date(grants[x].expiration),
          );

          if (differenceFromNow >= 0) {
            console.log('grant', grants[x].msg_type, 'is expired');
            return grants[x];
          }
        }
        return !grants[x];
      });
    },
    [activeAddr],
  );

  /**
   * Check and update a user's on-chain grants
   */
  const checkAndUpdateGrants = React.useCallback(
    async ({
      grantsToRequest,
      address,
      stayOnCurrentScreen,
    }: CheckAndUpdateGrantsArgs): Promise<{success: boolean}> => {
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
