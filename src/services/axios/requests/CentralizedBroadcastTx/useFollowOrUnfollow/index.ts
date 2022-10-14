import React from 'react';
import useCheckAndUpdateGrants, {
  CheckAndUpdateGrantsArgs,
} from 'hooks/authGrants/useCheckAndUpdateGrants';
import {GrantEnums} from 'lib/desmos/msgtypes';
import useActiveAccount from 'hooks/useActiveAccount';
import {useToast} from 'react-native-toast-notifications';
import {useTranslation} from 'react-i18next';
import ToastConfig from 'config/ToastConfig';
import {followingState} from '@recoil/following';
import useManageRelationship from 'services/axios/requests/CentralizedBroadcastTx/useFollowOrUnfollow/utils/useManageRelationship';
import {useRecoilValue} from 'recoil';
import usePendingRelationships, {
  pendingRelationshipsState,
} from '@recoil/pendingTx/pendingRelationships';
import {Alert} from 'react-native';

/**
 * @typedef FollowOrUnfollowUserArgs - Arguments for the followOrUnfollowUser callback
 * @property {boolean} [stayOnCurrentScreen = true] - Whether to stay on on the current screen following a grant authorization. Defaults to true.
 * @property {string} addrToFollow - The counterparty address to follow.
 */
interface FollowOrUnfollowUserArgs
  extends Partial<Pick<CheckAndUpdateGrantsArgs, 'stayOnCurrentScreen'>> {
  addrToFollow: string;
}

/**
 * A hook that exposes a callback that requests necessary grants and follows/unfollows another user.
 */
const useFollowOrUnfollow = () => {
  const {activeAddress} = useActiveAccount();
  const {checkAndUpdateGrants} = useCheckAndUpdateGrants();
  const toast = useToast();
  const {t} = useTranslation('toast');
  const following = useRecoilValue(followingState);
  const {createRelationship, deleteRelationship} = useManageRelationship();
  const [loading, setLoading] = React.useState(false);
  const {addNewPendingRelationship} = usePendingRelationships();
  const pendingRelationships = useRecoilValue(pendingRelationshipsState);

  /**
   * Callback to follow or unfollow (create/delete relationship) a user.
   * @param {FollowOrUnfollowUserArgs}
   */
  const followOrUnfollowUser = React.useCallback(
    async ({
      addrToFollow,
      stayOnCurrentScreen = true,
    }: FollowOrUnfollowUserArgs) => {
      if (pendingRelationships.length !== 0) {
        return Alert.alert(
          'PLACEHOLDER',
          'There is a pending follow or unfollow transaction. Please wait for the pending transaction to finish and try again.',
        );
      }
      if (!activeAddress) throw new Error('No active address found');
      const grantsToRequest = [
        GrantEnums.MsgCreateRelationship,
        GrantEnums.MsgDeleteRelationship,
      ];

      const {success} = await checkAndUpdateGrants({
        grantsToRequest,
        address: activeAddress,
        stayOnCurrentScreen,
      });

      if (!success) {
        return toast.show(t('errorAuthRequired'), {
          type: ToastConfig.ERROR_NO_RETRY,
        });
      }

      const isAlreadyFollowing = !!following.find(
        x => x.address === addrToFollow,
      );

      setLoading(true);
      try {
        let result: any;

        if (isAlreadyFollowing) {
          toast.show(t('successProcessUnfollow'), {type: ToastConfig.SUCCESS});
          result = await deleteRelationship({counterPartyAddr: addrToFollow});
        } else {
          toast.show(t('successProcessFollow'), {type: ToastConfig.SUCCESS});
          result = await createRelationship({counterPartyAddr: addrToFollow});
        }

        if (result) {
          addNewPendingRelationship({
            counterPartyAddr: addrToFollow,
            msgType: isAlreadyFollowing
              ? GrantEnums.MsgDeleteRelationship
              : GrantEnums.MsgCreateRelationship,
            timestamp: new Date().getTime(),
            txHash: result.tx_hash,
          });

          return true;
        }

        throw new Error('Error broadcasting transaction');
      } catch (err: any) {
        console.log('useFollowOrUnfollowUser', String(err));
      } finally {
        setLoading(false);
      }
    },
    [activeAddress, following, addNewPendingRelationship, pendingRelationships],
  );

  return {
    followOrUnfollowUser,
    loading,
  };
};

export default useFollowOrUnfollow;
