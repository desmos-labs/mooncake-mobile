import { useNavigation } from '@react-navigation/native';
import { differenceInMilliseconds } from 'date-fns';
import { GrantEnums } from 'lib/DesmosUtils/msgtypes';
import ROUTES from 'navigation/routes';
import React from 'react';
import { StyleProp, TextStyle } from 'react-native';
import useGetGrantsInformation from 'hooks/authorizations/useGetAuthorizationInformation';

/**
 * @typedef CheckAndUpdateGrantsArgs
 * @param {GrantEnums[]} Object.grantsToRequest - An Array of grants to request.
 * @param {boolean} Object.stayOnCurrentScreen - If true, will not call pop() after grant request process is completed.
 * @param {boolean} Object.detailsModal - An object containing details modal informations, such as title, body and so on.
 */
export interface CheckAndUpdateGrantsArgs {
  grantsToRequest: GrantEnums[];
  stayOnCurrentScreen?: boolean;
  detailsModal?: {
    title: string;
    body: string;
    bodyStyle?: StyleProp<TextStyle>;
    buttonLabel: string;
  };
}

/**
 * A Hook that checks and updates missing/expired grants. It will redirect
 * the user to the authorization popup and carry out the necessary steps
 * (unlocking wallet, broadcast tx, etc)
 */
const useCheckAndUpdateGrants = () => {
  const { navigate, pop } = useNavigation<any>();
  const { info } = useGetGrantsInformation();

  /**
   * Convenience function to check if the user has enabled a grant for a given list
   * @param {GrantEnums[]} grantsToCheck - check if user has provided grants for these grants
   * @return {GrantEnums[]} - an empty array or subset of grantsToCheck that have not yet been granted
   */
  const getPermissionsToGrant = React.useCallback(
    async (grantsToCheck: GrantEnums[]): Promise<GrantEnums[]> => {
      const grants: {
        [index: string]: { msg_type: GrantEnums; expiration: string };
      } = info.authz.grants.reduce((acc, cur) => {
        return {
          ...acc,
          [cur.msgTypeUrl]: cur,
        };
      }, {});

      return grantsToCheck.filter(x => {
        if (grants[x]) {
          const differenceFromNow = differenceInMilliseconds(
            Date.now(),
            new Date(grants[x].expiration),
          );

          if (differenceFromNow >= 0) {
            console.log('Grant', grants[x].msg_type, 'is expired');
            return grants[x];
          }
        }
        return !grants[x];
      });
    },
    [info.authz.grants],
  );

  /**
   * Allows to update the grants.
   * @return <code>true</code> if the update was successful, or <code>false</code> otherwise.
   */
  const updateGrants = React.useCallback(
    async (args: CheckAndUpdateGrantsArgs): Promise<boolean> => {
      return new Promise(resolve => {
        const { grantsToRequest, stayOnCurrentScreen, detailsModal } = args;
        if (grantsToRequest.length === 0) {
          resolve(true);
        } else {
          navigate(ROUTES.ACTION_AUTHORIZATION, {
            grants: grantsToRequest,
            detailsModal,
            onApprove: () => {
              !stayOnCurrentScreen && pop();
              resolve(true);
            },
            onCancel: () => {
              pop();
              resolve(false);
            },
          });
        }
      });
    },
    [navigate, pop],
  );

  /**
   * Check and update a user's on-chain grants.
   * @return <code>true</code> if the update was successful, or <code>false</code> otherwise.
   */
  const checkAndUpdateGrants = React.useCallback(
    async ({
      grantsToRequest,
      stayOnCurrentScreen,
      detailsModal,
    }: CheckAndUpdateGrantsArgs): Promise<boolean> => {
      const missingOrExpiredGrants = await getPermissionsToGrant(grantsToRequest);
      return updateGrants({
        grantsToRequest: missingOrExpiredGrants,
        stayOnCurrentScreen,
        detailsModal,
      });
    },
    [getPermissionsToGrant, updateGrants],
  );
  return {
    getPermissionsToGrant,
    checkAndUpdateGrants,
    updateGrants,
  };
};

export default useCheckAndUpdateGrants;
