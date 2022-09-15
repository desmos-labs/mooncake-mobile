import React from 'react';
import {MMKVKEYS, useMMKVStorage} from 'lib/MMKVStorage';
import {GrantEnums} from 'lib/desmos/msgtypes';
import {differenceInMilliseconds} from 'date-fns';
import useGetActiveGrants from 'services/axios/requests/GetActiveGrants/useGetActiveGrants';

const useCheckGrants = () => {
  const [activeAddr] = useMMKVStorage<string>(MMKVKEYS.ACTIVE_ACCOUNT_ADDR);
  const {getActiveGrants} = useGetActiveGrants();

  /**
   * Convenience function to check if the user has enabled a grant for a given list
   * @param {GrantEnums[]} grantsToCheck - check if user has provided grants for these grants
   * @return {GrantEnums[]} - an empty array or subset of grantsToCheck that have not yet been granted
   */
  const checkGrants = React.useCallback(
    async (grantsToCheck: GrantEnums[]): Promise<GrantEnums[]> => {
      if (!activeAddr) throw new Error('[checkGrant]: No active address found');

      const grantsResponse = await getActiveGrants();

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

  return {
    checkGrants,
  };
};

export default useCheckGrants;
