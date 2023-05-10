import { DesmosProfile } from 'types/desmos';
import { ChainInfo } from '@desmoslabs/desmjs/build/types/chains';
import { PostHog } from 'posthog-react-native';
import { PendingTransaction } from 'types/transactions';

/**
 * Identifies the user on PostHog.
 * @param posthog The PostHog instance to use
 * @param address The address of the user to identify
 * @param chainInfo The chain info of the chain the user is currently using
 * @param profile The Desmos profile of the user to identify
 */
export const identifyPostHogUser = (
  posthog: PostHog,
  address: string,
  chainInfo: ChainInfo,
  profile?: DesmosProfile,
) => {
  // If the user has an active profile, we identify them with their address and dTag
  if (profile) {
    posthog.identify(address, {
      dTag: profile.dTag,
      ChainID: chainInfo.chainName,
    });
    // If the user does not have an active profile, we identify them with their address only
  } else {
    posthog.identify(address, {
      ChainID: chainInfo.chainName,
    });
  }
};

/**
 * Captures the event of a transaction being performed.
 * @param posthog The PostHog instance to use
 * @param transaction The transaction that has been performed
 * @param memo The memo that has been used for the transaction
 */
export const capturePostHogTransactionEvent = (
  posthog: PostHog,
  transaction: PendingTransaction,
  memo?: string,
) => {
  posthog.capture('Transaction Performed', {
    CreationTime: transaction.timestamp,
    Address: transaction.user,
    TxHash: transaction.hash,
    Fees: transaction.fees,
    Messages: transaction.messages,
    memo,
  });
};

/**
 * Captures the event of a transaction being broadcasted.
 * @param posthog The PostHog instance to use
 * @param receiverAddress The address of the user that has been invited
 * @param inviteCode The invite code that has been used
 */
export const capturePostHogInviteRedeemEvent = (
  posthog: PostHog,
  receiverAddress: string,
  inviteCode: string,
) => {
  posthog.capture('Invite Redeemed', {
    InviteCode: inviteCode,
    Receiver: receiverAddress,
    RedeemTime: new Date().toISOString(),
  });
};
