import { ChainInfo } from '@desmoslabs/desmjs';
import { PostHog } from 'posthog-react-native';
import { PendingTransaction } from 'types/transactions';
import Aes from 'react-native-aes-crypto';

/**
 * Identifies the user on PostHog.
 * @param posthog The PostHog instance to use
 * @param address The address of the user to identify
 * @param chainInfo The chain info of the chain the user is currently using
 */
export const identifyPostHogUser = async (
  posthog: PostHog,
  address: string,
  chainInfo: ChainInfo,
) => {
  if (address && chainInfo) {
    // We hash the address to avoid sending it in plain text
    const addressHash = await Aes.sha256(address);
    // We identify the user on PostHog
    posthog.identify(addressHash, {
      ChainID: chainInfo.chainName,
    });
  }
};

/**
 * Captures the event of a transaction being performed.
 * @param posthog The PostHog instance to use
 * @param transaction The transaction that has been performed
 */
export const capturePostHogTransactionEvent = (
  posthog: PostHog,
  transaction: PendingTransaction,
) => {
  posthog.capture('Transaction Performed', {
    CreationTime: transaction.timestamp,
    Fees: transaction.fees,
    MsgType: transaction.messages.map(msg => msg.typeUrl),
  });
};

/**
 * Captures the event of a transaction being broadcasted.
 * @param posthog The PostHog instance to use
 * @param inviteCode The invite code that has been used
 */
export const capturePostHogInviteRedeemEvent = (posthog: PostHog, inviteCode: string) => {
  posthog.capture('Invite Redeemed', {
    InviteCode: inviteCode,
    RedeemTime: new Date().toISOString(),
  });
};
