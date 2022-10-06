import React from 'react';
import useCheckAndUpdateGrants from 'hooks/authGrants/useCheckAndUpdateGrants';
import {GrantEnums} from 'lib/desmos/msgtypes';
import useActiveAccount from 'hooks/useActiveAccount';
import {useToast} from 'react-native-toast-notifications';
import {useTranslation} from 'react-i18next';
import ToastConfig from 'config/ToastConfig';
import {followingState} from '@recoil/following';
import useManageRelationship from 'services/axios/requests/CentralizedBroadcastTx/ManageRelationship/useManageRelationship';
import {useRecoilValue} from 'recoil';

type FollowOrUnfollowParams = {
  addrToFollow: string;
};

const useFollowOrUnfollowUser = () => {
  const {activeAddress} = useActiveAccount();
  const {checkAndUpdateGrants} = useCheckAndUpdateGrants();
  const toast = useToast();
  const {t} = useTranslation('toast');
  const following = useRecoilValue(followingState);
  const {createRelationship, deleteRelationship} = useManageRelationship();
  const [loading, setLoading] = React.useState(false);

  const followOrUnfollowUser = React.useCallback(
    async ({addrToFollow}: FollowOrUnfollowParams) => {
      if (!activeAddress) throw new Error('No active address found');
      const grantsToRequest = [
        GrantEnums.MsgCreateRelationship,
        GrantEnums.MsgDeleteRelationship,
      ];

      const {success} = await checkAndUpdateGrants({
        grantsToRequest,
        address: activeAddress,
        stayOnCurrentScreen: true,
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
        let result;

        if (isAlreadyFollowing) {
          result = await deleteRelationship({counterPartyAddr: addrToFollow});
        } else {
          result = await createRelationship({counterPartyAddr: addrToFollow});
        }

        console.log(result);

        return true;
      } catch (err: any) {
        console.log('useFollowOrUnfollowUser', err.toString());
      } finally {
        setLoading(false);
      }
    },
    [activeAddress, following],
  );

  return {
    followOrUnfollowUser,
    loading,
  };
};

export default useFollowOrUnfollowUser;
