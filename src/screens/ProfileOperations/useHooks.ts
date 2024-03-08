import {
  Authz,
  Bank,
  Feegrant,
  Posts,
  Profiles,
  Reactions,
  Relationships,
  Reports,
} from '@desmoslabs/desmjs';
import {
  blockUserTx,
  createPostTxIcon,
  createReportTx,
  editProfileTxIcon,
  followUserTx,
  likePostTx,
  tipTxIcon,
  unfollowUserTx,
  unknownTxIcon,
  unlikePostTx,
} from 'assets/images';
import { getDate } from 'date-fns';
import usePastTransactions from 'hooks/transactions/usePastTransactions';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { SectionBase } from 'react-native';
import { MsgExecTypeUrl } from 'types/desmos';
import { PastTransactionMessage } from 'types/transactions';

/**
 * Type that contains the details of a single section of the list of past actions.
 */
interface MessagesSection extends SectionBase<PastTransactionMessage> {
  readonly title: string;
  readonly timestamp: string;
  readonly data: PastTransactionMessage[];
}

/**
 * Function that allows to split the given {@link PastTransactionMessage} into different {@link MessagesSection},
 * each one having:
 * - the `title` equals to the data inside which such messages where executed
 * - the `data` containing all the messages that were included inside a transaction having such date.
 */
const groupMessagesByDate = (messages: PastTransactionMessage[]) => {
  const sections: MessagesSection[] = [];
  messages.forEach(message => {
    const sectionIndex = sections.findIndex(
      section => getDate(new Date(section.timestamp)) === getDate(new Date(message.timestamp)),
    );
    if (sectionIndex === -1) {
      sections.push({
        title: message.timestamp,
        data: [message],
        timestamp: message.timestamp,
      });
    } else {
      sections[sectionIndex].data.push(message);
    }
  });
  return sections;
};

export const useGetOperationImage = () => {
  return React.useCallback((messageType: string) => {
    const formattedMessage = `/${messageType}`;
    switch (formattedMessage) {
      // Bank module.
      case Bank.v1beta1.MsgSendTypeUrl:
        return tipTxIcon;

      // Posts module.
      case Posts.v3.MsgCreatePostTypeUrl:
      case Posts.v3.MsgEditPostTypeUrl:
      case Posts.v3.MsgDeletePostTypeUrl:
      case Posts.v3.MsgAddPostAttachmentTypeUrl:
      case Posts.v3.MsgRemovePostAttachmentTypeUrl:
      case Posts.v3.MsgAnswerPollTypeUrl:
      case Posts.v3.MsgMovePostTypeUrl:
      case Posts.v3.MsgRequestPostOwnerTransferTypeUrl:
      case Posts.v3.MsgCancelPostOwnerTransferRequestTypeUrl:
      case Posts.v3.MsgAcceptPostOwnerTransferRequestTypeUrl:
      case Posts.v3.MsgRefusePostOwnerTransferRequestTypeUrl:
        return createPostTxIcon;

      // Reactions module.
      case Reactions.v1.MsgAddReactionTypeUrl:
        return likePostTx;
      case Reactions.v1.MsgRemoveReactionTypeUrl:
        return unlikePostTx;

      case Reports.v1.MsgCreateReportTypeUrl:
      case Reports.v1.MsgDeleteReportTypeUrl:
        return createReportTx;

      // Profiles module.
      case Profiles.v3.MsgSaveProfileTypeUrl:
      case Profiles.v3.MsgDeleteProfileTypeUrl:
      case Profiles.v3.MsgRequestDTagTransferTypeUrl:
      case Profiles.v3.MsgAcceptDTagTransferRequestTypeUrl:
      case Profiles.v3.MsgRefuseDTagTransferRequestTypeUrl:
      case Profiles.v3.MsgCancelDTagTransferRequestTypeUrl:
      case Profiles.v3.MsgLinkApplicationTypeUrl:
      case Profiles.v3.MsgUnlinkApplicationTypeUrl:
      case Profiles.v3.MsgLinkChainAccountTypeUrl:
      case Profiles.v3.MsgUnlinkChainAccountTypeUrl:
        return editProfileTxIcon;

      // Relationships module.
      case Relationships.v1.MsgCreateRelationshipTypeUrl:
        return followUserTx;
      case Relationships.v1.MsgDeleteRelationshipTypeUrl:
        return unfollowUserTx;
      case Relationships.v1.MsgBlockUserTypeUrl:
      case Relationships.v1.MsgUnblockUserTypeUrl:
        return blockUserTx;

      case MsgExecTypeUrl:
      case Authz.v1beta1.MsgGrantTypeUrl:
      case Feegrant.v1beta1.MsgGrantAllowanceTypeUrl:
        return unknownTxIcon;

      default:
        console.warn(`No image found for message type ${formattedMessage}`);
        return unknownTxIcon;
    }
  }, []);
};

export const useGetOperationTitle = (userAddress: string) => {
  const { t } = useTranslation('operations');

  return React.useCallback(
    (message: PastTransactionMessage) => {
      const formattedMessage = `/${message.type}`;
      switch (formattedMessage) {
        // Bank module.
        case Bank.v1beta1.MsgSendTypeUrl:
          if (message.senderAddress === userAddress) {
            return t('send tip');
          } else {
            return t('receive tip');
          }

        // Posts module.
        case Posts.v3.MsgCreatePostTypeUrl:
          return t('create comment post');
        case Posts.v3.MsgEditPostTypeUrl:
          return t('edit comment post');
        case Posts.v3.MsgDeletePostTypeUrl:
          return t('delete post');
        case Posts.v3.MsgAddPostAttachmentTypeUrl:
          return t('add post attachment');
        case Posts.v3.MsgRemovePostAttachmentTypeUrl:
          return t('remove post attachment');
        case Posts.v3.MsgAnswerPollTypeUrl:
          return t('answer poll');
        case Posts.v3.MsgMovePostTypeUrl:
          return t('move post comment');
        case Posts.v3.MsgRequestPostOwnerTransferTypeUrl:
          return t('request post owner transfer');
        case Posts.v3.MsgCancelPostOwnerTransferRequestTypeUrl:
          return t('cancel post owner transfer request');
        case Posts.v3.MsgAcceptPostOwnerTransferRequestTypeUrl:
          return t('accept post owner transfer request');
        case Posts.v3.MsgRefusePostOwnerTransferRequestTypeUrl:
          return t('refuse post owner transfer request');

        // Profiles module.
        case Profiles.v3.MsgSaveProfileTypeUrl:
          return t('edit profile');
        case Profiles.v3.MsgDeleteProfileTypeUrl:
          return t('delete profile');
        case Profiles.v3.MsgRequestDTagTransferTypeUrl:
          return t('request dtag transfer');
        case Profiles.v3.MsgAcceptDTagTransferRequestTypeUrl:
          return t('accept dtag transfer request');
        case Profiles.v3.MsgRefuseDTagTransferRequestTypeUrl:
          return t('refuse dtag transfer request');
        case Profiles.v3.MsgCancelDTagTransferRequestTypeUrl:
          return t('cancel dtag transfer request');
        case Profiles.v3.MsgLinkApplicationTypeUrl:
          return t('link application');
        case Profiles.v3.MsgUnlinkApplicationTypeUrl:
          return t('unlink application');
        case Profiles.v3.MsgLinkChainAccountTypeUrl:
          return t('link chain account');
        case Profiles.v3.MsgUnlinkChainAccountTypeUrl:
          return t('unlink chain account');

        // Reactions module.
        case Reactions.v1.MsgAddReactionTypeUrl:
          return t('add reaction');
        case Reactions.v1.MsgRemoveReactionTypeUrl:
          return t('remove reaction');

        // Relationships module.
        case Relationships.v1.MsgCreateRelationshipTypeUrl:
          return t('follow user');
        case Relationships.v1.MsgDeleteRelationshipTypeUrl:
          return t('unfollow user');
        case Relationships.v1.MsgBlockUserTypeUrl:
          return t('block user');
        case Relationships.v1.MsgUnblockUserTypeUrl:
          return t('unblock user');

        // Reports module.
        case Reports.v1.MsgCreateReportTypeUrl:
          return t('create report');
        case Reports.v1.MsgDeleteReportTypeUrl:
          return t('delete report');

        case Authz.v1beta1.MsgGrantTypeUrl:
          return t('grant permission');
        case Feegrant.v1beta1.MsgGrantAllowanceTypeUrl:
          return t('grant fee allowance');
        case MsgExecTypeUrl:
          return t('execute');

        default:
          console.warn(`No title found for message type ${formattedMessage}`);
          // Gets the msg name, like MsgSend.
          return formattedMessage.split('.').pop();
      }
    },
    [t, userAddress],
  );
};

/**
 * Hook that returns the list of past actions of a user, grouped by date.
 */
export const usePastActionsSections = (address: string, transactionsPerPage: number = 20) => {
  const { transactions, loading, fetchMore, fetchingMore, refresh, refreshing } =
    usePastTransactions(address, transactionsPerPage);

  return {
    sections: groupMessagesByDate(transactions),
    loading,
    refreshing,
    fetchMore,
    fetchingMore,
    refetch: refresh,
  };
};
