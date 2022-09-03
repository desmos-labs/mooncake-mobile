import {useCallback, useMemo, useState} from 'react';
import {computeTxFees, messagesGas} from 'lib/desmos/fees';
import {
  MsgCreateRelationshipEncodeObject,
  MsgDeleteRelationshipEncodeObject,
} from '@desmoslabs/desmjs';
import {EncodeObject, OfflineSigner} from '@cosmjs/proto-signing';
import MsgTypes from 'lib/desmos/msgtypes';
import Long from 'long';
import EnvConfig from 'config/EnvConfig';
import {useRecoilCallback, useRecoilValue} from 'recoil';
import {followingState} from '@recoil/following';
import followedAddressesState from '@recoil/followedAddressesState';
import {useTranslation} from 'react-i18next';
import useBroadcastMessages from './broadcastTx/useBroadcastMessages';
import useActiveAccount from './useActiveAccount';
import useUnlockWallet from './useUnlockWallet';

export default function useFollowUser(
  subspaceID: number,
  counterParty: CounterParty,
) {
  const broadcastMessages = useBroadcastMessages();
  const followedAddresses = useRecoilValue(followedAddressesState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const {t} = useTranslation('followingAndFollowers');

  const unlockWallet = useUnlockWallet();
  const {chainAccount} = useActiveAccount();
  const {address} = counterParty;

  /* A react hook that is used to memoize the value of following. */
  const following = useMemo(
    () => followedAddresses.has(address),
    [followedAddresses, address],
  );

  /* A function that is used to unlock the wallet and get the offlineSigner. */
  const unlockingWallet = useCallback(async () => {
    if (!chainAccount) throw new Error(t('noActiveAccountFound'));
    /* Unlocking the wallet and getting the offlineSigner. */
    const unlockedWallet = await unlockWallet(chainAccount);
    const offlineSigner = unlockedWallet?.wallet;
    if (!offlineSigner) throw new Error(t('pleaseUnlockYourWallet'));
    const signer = chainAccount.address;
    return {signer, offlineSigner};
  }, [chainAccount]);

  /* A function that is used to calculate the gas and fees for the transaction and broadcasting it. */
  const boardcastEncodeObject = useCallback(
    (
      uncodeObject: EncodeObject,
      offlineSigner: OfflineSigner,
      granter: string,
    ) => {
      /* Calculating the gas and fees for the transaction and broadcasting it. */
      const messages = [uncodeObject];
      const gas = messagesGas(messages);
      const txFee = computeTxFees(gas, EnvConfig.BASE_DENOM).average;
      broadcastMessages(offlineSigner, messages, txFee, '', granter);
    },
    [],
  );

  /* A function that is used to follow a user. */
  const follow = useRecoilCallback(
    ({set}) =>
      async () => {
        try {
          setLoading(true);
          setError(undefined);

          /* Unlocking the wallet and getting the offlineSigner. */
          const {signer, offlineSigner} = await unlockingWallet();

          /* Creating a message object that will be sent to the blockchain. */
          const uncodeObject: MsgCreateRelationshipEncodeObject = {
            typeUrl: MsgTypes.MsgCreateRelationship,
            value: {
              signer,
              counterparty: address,
              subspaceId: Long.fromNumber(subspaceID),
            },
          };
          boardcastEncodeObject(uncodeObject, offlineSigner, signer);

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

          /* Unlocking the wallet and getting the offlineSigner. */
          const {signer, offlineSigner} = await unlockingWallet();

          /* Creating a message object that will be sent to the blockchain. */
          const uncodeObject: MsgDeleteRelationshipEncodeObject = {
            typeUrl: MsgTypes.MsgDeleteRelationship,
            value: {
              signer,
              counterparty: address,
              subspaceId: Long.fromNumber(subspaceID),
            },
          };
          boardcastEncodeObject(uncodeObject, offlineSigner, signer);

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
