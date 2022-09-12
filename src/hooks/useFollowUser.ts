import {EncodeObject} from '@cosmjs/proto-signing';
import {
  MsgCreateRelationshipEncodeObject,
  MsgDeleteRelationshipEncodeObject,
} from '@desmoslabs/desmjs';
import followedAddressesState from '@recoil/followedAddressesState';
import {followingState} from '@recoil/following';
import EnvConfig from 'config/EnvConfig';
import {computeTxFees, messagesGas} from 'lib/desmos/fees';
import MsgTypes from 'lib/desmos/msgtypes';
import Long from 'long';
import {useCallback, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useRecoilCallback, useRecoilValue} from 'recoil';
import {ChainAccount} from 'types/chains';
import useBroadcastMessages from './broadcastTx/useBroadcastMessages';
import useActiveAccount from './useActiveAccount';
import useUnlockWallet from './useUnlockWallet';

export default function useFollowUser(
  subspaceID: number,
  counterParty: CounterParty,
) {
  const followedAddresses = useRecoilValue(followedAddressesState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  const {address} = counterParty;

  /* A react hook that is used to memoize the value of following. */
  const following = useMemo(
    () => followedAddresses.has(address),
    [followedAddresses, address],
  );

  const {chainAccount} = useActiveAccount();
  const boardcastEncodeObject = useBoardcastEncodeObject();
  const {t} = useTranslation('followingAndFollowers');

  /* A function that is used to follow a user. */
  const follow = useRecoilCallback(
    ({set}) =>
      async () => {
        try {
          setLoading(true);
          setError(undefined);

          if (!chainAccount) throw new Error(t('noActiveAccountFound'));

          /* Creating a message object that will be sent to the blockchain. */
          const uncodeObject: MsgCreateRelationshipEncodeObject = {
            typeUrl: MsgTypes.MsgCreateRelationship,
            value: {
              signer: chainAccount.address,
              counterparty: address,
              subspaceId: Long.fromNumber(subspaceID),
            },
          };
          boardcastEncodeObject(uncodeObject, chainAccount);

          /* Adding the counterParty to the followingState. */
          set(followingState, curVal => {
            const index = curVal.findIndex(c => c.address === address);
            if (index === -1) curVal;
            return curVal.concat(counterParty);
          });

          setLoading(false);
          setError(undefined);
        } catch (err) {
          setLoading(false);
          setError(String(err));
        }
      },
    [subspaceID, address, counterParty],
  );

  /* A function that is used to unfollow a user. */
  const unfollow = useRecoilCallback(
    ({set}) =>
      async () => {
        try {
          setLoading(true);
          setError(undefined);

          if (!chainAccount) throw new Error(t('noActiveAccountFound'));

          /* Creating a message object that will be sent to the blockchain. */
          const uncodeObject: MsgDeleteRelationshipEncodeObject = {
            typeUrl: MsgTypes.MsgDeleteRelationship,
            value: {
              signer: chainAccount.address,
              counterparty: address,
              subspaceId: Long.fromNumber(subspaceID),
            },
          };
          boardcastEncodeObject(uncodeObject, chainAccount);

          /* Removing the counterParty to the followingState. */
          set(followingState, curVal => {
            const index = curVal.findIndex(v => v.address === address);
            if (index === -1) curVal;
            return curVal.filter((_, i) => i !== index);
          });

          setLoading(false);
          setError(undefined);
        } catch (err) {
          setLoading(false);
          setError(String(err));
        }
      },
    [subspaceID, address],
  );

  return {following, loading, error, follow, unfollow};
}

/**
 * It's a function that is used to unlock the wallet and get the offlineSigner, calculate the gas and
 * fees for the transaction and broadcasting it
 * @returns A function that is used to calculate the gas and fees for the transaction and broadcasting
 * it.
 */
function useBoardcastEncodeObject() {
  const broadcastMessages = useBroadcastMessages();
  const unlockWallet = useUnlockWallet();
  const {t} = useTranslation('followingAndFollowers');

  /* A function that is used to calculate the gas and fees for the transaction and broadcasting it. */
  const boardcastEncodeObject = useCallback(
    async (uncodeObject: EncodeObject, chainAccount: ChainAccount) => {
      /* Unlocking the wallet and getting the offlineSigner. */
      const unlockedWallet = await unlockWallet(chainAccount);
      const offlineSigner = unlockedWallet?.wallet;
      if (!offlineSigner) throw new Error(t('pleaseUnlockYourWallet'));
      const signer = chainAccount.address;

      /* Calculating the gas and fees for the transaction and broadcasting it. */
      const messages = [uncodeObject];
      const gas = messagesGas(messages);
      const txFee = computeTxFees(gas, EnvConfig.BASE_DENOM).average;
      broadcastMessages(offlineSigner, messages, txFee, '', signer);
    },
    [],
  );

  return boardcastEncodeObject;
}
