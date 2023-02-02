import React, { useCallback } from 'react';
import useCheckAndUpdateGrants, {
  CheckAndUpdateGrantsArgs,
} from 'hooks/authGrants/useCheckAndUpdateGrants';
import { GrantEnums } from 'lib/desmos/msgtypes';
import useActiveAccount from 'hooks/useActiveAccount';
import EnvConfig from 'config/EnvConfig';
import ToastConfig from 'config/ToastConfig';
import { useLazyQuery } from '@apollo/client';
import { GetReactionForPostAndAuthor } from 'services/graphql/queries/GetReactions';
import { useToast } from 'react-native-toast-notifications';
import { manageReaction } from './utils';

/**
 * @typedef AddOrRemoveReactionArgs - Arguments for the addOrRemoveReaction callback
 * @property {boolean} [stayOnCurrentScreen = true] - Whether to stay on on the current screen following a grant authorization. Defaults to true.
 * @property {number} postId - The postId to add a reaction to.
 */
interface AddOrRemoveReactionArgs
  extends Partial<Pick<CheckAndUpdateGrantsArgs, 'stayOnCurrentScreen'>> {
  postId: number;
}

/**
 * A hook that exposes a callback that requests necessary grants and adds/removes a reaction from a post.
 */
const useAddOrRemoveReaction = () => {
  const { activeAddress } = useActiveAccount();
  const { checkAndUpdateGrants } = useCheckAndUpdateGrants();
  const toast = useToast();

  const [loading, setLoading] = React.useState(false);

  const [getReactionForPostAndAuthor] = useLazyQuery(GetReactionForPostAndAuthor, {
    fetchPolicy: 'no-cache',
  });

  const getReaction = useCallback(
    async ({ id, subspace_id, address }: { id: number; subspace_id: number; address: string }) => {
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

  /**
   * Callback to add or remove a reaction to/from a post
   * @param {AddOrRemoveReactionArgs}
   */
  const addOrRemoveReaction = React.useCallback(
    async ({ postId, stayOnCurrentScreen = true }: AddOrRemoveReactionArgs) => {
      const grantsToRequest: GrantEnums[] = [
        GrantEnums.MsgAddReaction,
        GrantEnums.MsgRemoveReaction,
      ];
      // check if user has grants first
      const { success } = await checkAndUpdateGrants({
        grantsToRequest,
        stayOnCurrentScreen,
      });

      if (!success) {
        return toast.show('[PLACEHOLDER]Authorization is required.', {
          type: ToastConfig.ERROR_NO_RETRY,
        });
      }

      setLoading(true);

      try {
        const { data } = await getReaction({
          id: postId,
          subspace_id: EnvConfig.APP_SUBSPACE_ID,
          address: activeAddress!,
        });

        return manageReaction({
          postId,
          user: activeAddress!,
          reactionId: data?.reaction[0] ? data?.reaction[0].id : undefined,
        });
      } catch (err: any) {
        console.log('useAddOrRemoveReaction', String(err));
      } finally {
        setLoading(false);
      }
    },
    [activeAddress],
  );

  return {
    addOrRemoveReaction,
    loading,
  };
};

export default useAddOrRemoveReaction;
