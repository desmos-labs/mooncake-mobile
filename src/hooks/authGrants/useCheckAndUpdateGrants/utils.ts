// adapted from useCheckGrants
import {GrantEnums} from 'lib/desmos/msgtypes';
import GetActiveGrants from 'services/axios/requests/GetActiveGrants';
import {differenceInMilliseconds} from 'date-fns';

/**
 * Check if a given account by address has grantsToCheck grants
 * @param {GrantEnums[]} grantsToCheck The array of grants to check.
 * @param {string} address The address of the account to check grants for.
 * @return {Promise<GrantEnums[]>} A promise that resolves to an array of GrantEnums that the account does not have
 *                                 or have expired.
 */
// eslint-disable-next-line import/prefer-default-export
export const checkGrants = async (
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
