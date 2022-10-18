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
 * @param {boolean} Object.stayOnCurrentScreen - If true, will not call pop() after grant request process is completed.
 */
export interface CheckAndUpdateGrantsArgs {
  grantsToRequest: GrantEnums[];
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

  const updateGrants = React.useCallback(
    async ({
      grantsToRequest,
      stayOnCurrentScreen,
    }: CheckAndUpdateGrantsArgs): Promise<{success: boolean}> => {
      return new Promise(resolve => {
        if (grantsToRequest.length === 0) {
          resolve({success: true});
        } else {
          navigate(ROUTES.ACTION_AUTHORIZATION, {
            grants: grantsToRequest,
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

  /**
   * Check and update a user's on-chain grants
   */
  const checkAndUpdateGrants = React.useCallback(
    async ({
      grantsToRequest,
      stayOnCurrentScreen,
    }: CheckAndUpdateGrantsArgs): Promise<{success: boolean}> => {
      const missingOrExpiredGrants = await checkGrants(grantsToRequest);

      return updateGrants({
        grantsToRequest: missingOrExpiredGrants,
        stayOnCurrentScreen,
      });
    },
    [],
  );
  return {
    checkAndUpdateGrants,
    checkGrants,
    updateGrants,
  };
};

export default useCheckAndUpdateGrants;
