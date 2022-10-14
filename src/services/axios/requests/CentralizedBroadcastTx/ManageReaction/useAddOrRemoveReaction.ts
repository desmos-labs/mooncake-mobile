import React, {useCallback} from 'react';
import useCheckAndUpdateGrants, {
  CheckAndUpdateGrantsArgs,
} from 'hooks/authGrants/useCheckAndUpdateGrants';
import {GrantEnums} from 'lib/desmos/msgtypes';
import useActiveAccount from 'hooks/useActiveAccount';
import EnvConfig from 'config/EnvConfig';
import ToastConfig from 'config/ToastConfig';
import {useLazyQuery} from '@apollo/client';
import {GetReactionForPostAndAuthor} from 'services/graphql/queries/GetReactions';
import useManageReactions from 'services/axios/requests/CentralizedBroadcastTx/ManageReaction/utils/useManageReactions';
import {useToast} from 'react-native-toast-notifications';

interface Params
  extends Partial<Pick<CheckAndUpdateGrantsArgs, 'stayOnCurrentScreen'>> {
  postId: number;
}

const useAddOrRemoveReaction = () => {
  const {activeAddress} = useActiveAccount();
  const {checkAndUpdateGrants} = useCheckAndUpdateGrants();
  const {manageReaction} = useManageReactions();
  const toast = useToast();

  const [loading, setLoading] = React.useState(false);

  const [getReactionForPostAndAuthor] = useLazyQuery(
    GetReactionForPostAndAuthor,
    {
      fetchPolicy: 'no-cache',
    },
  );

  const getReaction = useCallback(
    async ({
      id,
      subspace_id,
      address,
    }: {
      id: number;
      subspace_id: number;
      address: string;
    }) => {
      return getReactionForPostAndAuthor({
        variables: {
          postID: id,
          subspaceID: subspace_id,
          address,
        },
      });
    },
    [activeAddress, getReactionForPostAndAuthor],
  );

  const addOrRemoveReaction = React.useCallback(
    async ({postId, stayOnCurrentScreen = true}: Params) => {
      const grantsToRequest: GrantEnums[] = [
        GrantEnums.MsgAddReaction,
        GrantEnums.MsgRemoveReaction,
      ];
      // check if user has grants first
      const {success} = await checkAndUpdateGrants({
        grantsToRequest,
        address: activeAddress!,
        stayOnCurrentScreen,
      });

      if (!success) {
        return toast.show('[PLACEHOLDER]Authorization is required.', {
          type: ToastConfig.ERROR_NO_RETRY,
        });
      }

      setLoading(true);

      try {
        const {data} = await getReaction({
          id: postId,
          subspace_id: EnvConfig.APP_SUBSPACE_ID,
          address: activeAddress!,
        });

        return manageReaction({
          postId,
          user: activeAddress!,
          reactionId: data?.reaction[0] ? data?.reaction[0].id : undefined,
        });
      } finally {
        setLoading(false);
      }
    },
    [activeAddress],
  );

  return {
    loading,
    addOrRemoveReaction,
  };
};

export default useAddOrRemoveReaction;
