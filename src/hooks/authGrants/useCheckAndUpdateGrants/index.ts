import React from 'react';
import {GrantEnums} from 'lib/desmos/msgtypes';
import {differenceInMilliseconds} from 'date-fns';
import GetActiveGrants from 'services/axios/requests/GetActiveGrants';
import {useNavigation} from '@react-navigation/native';
import ROUTES from 'navigation/routes';

// adapted from useCheckGrants
/**
 * Check if a given account by address has grantsToCheck grants
 * @param {GrantEnums[]} grantsToCheck The array of grants to check.
 * @param {string} address The address of the account to check grants for.
 * @return {Promise<GrantEnums[]>} A promise that resolves to an array of GrantEnums that the account does not have
 *                                 or have expired.
 */
const checkGrants = async (
  grantsToCheck: GrantEnums[],
  address: string,
): Promise<GrantEnums[]> => {
  const grantsResponse = await GetActiveGrants({address});

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
};

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
