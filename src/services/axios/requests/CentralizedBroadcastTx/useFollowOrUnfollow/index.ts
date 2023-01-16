import React from 'react';
import useCheckAndUpdateGrants, {
  CheckAndUpdateGrantsArgs,
} from 'hooks/authGrants/useCheckAndUpdateGrants';
import {GrantEnums} from 'lib/desmos/msgtypes';
import useActiveAccount from 'hooks/useActiveAccount';
import {useToast} from 'react-native-toast-notifications';
import {useTranslation} from 'react-i18next';
import ToastConfig from 'config/ToastConfig';
import {isFollowingAddr, useGetFollowingForAddress} from '@recoil/following';
import {useRecoilCallback} from 'recoil';
import {
  MsgCreateRelationship,
  MsgDeleteRelationship,
} from '@desmoslabs/desmjs-types/desmos/relationships/v1/msgs';
import Long from 'long';
import EnvConfig from 'config/EnvConfig';
import {encodeAndBroadcastTx} from 'services/axios/requests/CentralizedBroadcastTx';
import {
  MsgCreateRelationshipEncodeObject,
  MsgDeleteRelationshipEncodeObject,
} from '@desmoslabs/desmjs';
import useOptimisticRelationships from '@recoil/optimisticUI/optimisticRelationships';

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
  const [loading, setLoading] = React.useState(false);

  const {updateFollowing} = useGetFollowingForAddress(activeAddress);

  const {handleOptimisticRelationship} = useOptimisticRelationships();

  const {resolveOptimisticRelationshipForAddress} =
    useOptimisticRelationships();

  /**
   * Callback to follow or unfollow (create/delete relationship) a user.
   * @param {FollowOrUnfollowUserArgs}
   */
  const followOrUnfollowUser = useRecoilCallback(
    ({snapshot}) =>
      async ({
        addrToFollow,
        stayOnCurrentScreen = true,
      }: FollowOrUnfollowUserArgs) => {
        if (!activeAddress) throw new Error('No active address found');

        setLoading(true);

        const isAlreadyFollowing = await snapshot.getPromise(
          isFollowingAddr(addrToFollow),
        );

        await handleOptimisticRelationship({
          counterParty: addrToFollow,
          type: isAlreadyFollowing ? 'unfollow' : 'follow',
        });

        const grantsToRequest = [
          GrantEnums.MsgCreateRelationship,
          GrantEnums.MsgDeleteRelationship,
        ];

        const {success} = await checkAndUpdateGrants({
          grantsToRequest,
          stayOnCurrentScreen,
        });

        if (!success) {
          return toast.show(t('errorAuthRequired'), {
            type: ToastConfig.ERROR_NO_RETRY,
          });
        }

        try {
          let msg:
            | MsgDeleteRelationshipEncodeObject
            | MsgCreateRelationshipEncodeObject;

          if (isAlreadyFollowing) {
            msg = {
              typeUrl: GrantEnums.MsgDeleteRelationship,
              value: MsgDeleteRelationship.fromPartial({
                signer: activeAddress,
                counterparty: addrToFollow,
                subspaceId: Long.fromNumber(EnvConfig.APP_SUBSPACE_ID),
              }),
            };
          } else {
            msg = {
              typeUrl: GrantEnums.MsgCreateRelationship,
              value: MsgCreateRelationship.fromPartial({
                signer: activeAddress,
                counterparty: addrToFollow,
                subspaceId: Long.fromNumber(EnvConfig.APP_SUBSPACE_ID),
              }),
            };
          }

          const result = await encodeAndBroadcastTx({
            msgs: [msg],
            optimistic: true,
          });

          if (result) {
            return true;
          }

          throw new Error('Error broadcasting transaction');
        } catch (err: any) {
          console.log('useFollowOrUnfollowUser', String(err));
          toast.show(String(err), {type: ToastConfig.ERROR_NO_RETRY});
        } finally {
          setLoading(false);
          await updateFollowing();
          await resolveOptimisticRelationshipForAddress(addrToFollow);
        }
      },
    [activeAddress, handleOptimisticRelationship],
  );

  return {
    followOrUnfollowUser,
    loading,
  };
};

export default useFollowOrUnfollow;
