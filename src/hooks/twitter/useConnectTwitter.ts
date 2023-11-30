import React from 'react';
import { TwitterTweet, TwitterUser } from 'types/twitter';
import { Profiles } from '@desmoslabs/desmjs';
import Long from 'long';
import useButterConfig from 'hooks/config/useButterConfig';
import { useActiveAccountAddress } from '@recoil/accounts';
import useBroadcastTx from 'hooks/transactions/useBroadcastTx';
import { err } from 'neverthrow';

/**
 * Hook that provides a function to connect a Twitter account to the currently active Desmos profile.
 */
const useConnectTwitter = () => {
  const activeAccountAddress = useActiveAccountAddress();
  if (!activeAccountAddress) {
    throw new Error('Cannot connect Twitter without an active account');
  }

  const butterConfig = useButterConfig();
  const ibcConfig = butterConfig.config?.ibc;

  const broadcastTx = useBroadcastTx();

  return React.useCallback(
    async (user: TwitterUser, tweet: TwitterTweet) => {
      if (!ibcConfig) {
        return err(new Error('Cannot connect Twitter app without proper IBC config'));
      }

      // Build the verification data and convert it to hex
      const verificationData = { method: 'tweet', value: tweet.id };
      const verificationDataHex = Buffer.from(JSON.stringify(verificationData)).toString('hex');

      // Build the message to link Twitter
      const msg: Profiles.v3.MsgLinkApplicationEncodeObject = {
        typeUrl: Profiles.v3.MsgLinkApplicationTypeUrl,
        value: {
          sender: activeAccountAddress,
          linkData: {
            application: 'twitter',
            username: user.username,
          },
          callData: verificationDataHex,
          sourcePort: ibcConfig.port,
          sourceChannel: ibcConfig.channel,
          timeoutHeight: undefined,
          timeoutTimestamp: Long.fromNumber((Date.now() + 3600000) * 1000000),
        },
      };

      // Broadcast the transaction
      return broadcastTx([msg]);
    },
    [activeAccountAddress, broadcastTx, ibcConfig],
  );
};

export default useConnectTwitter;
