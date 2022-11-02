import React from 'react';
import {ExternalAccount, ExternalAccountEnum} from '@recoil/connectChainState';
import {
  Proof,
  SignatureValueType,
} from '@desmoslabs/desmjs-types/desmos/profiles/v3/models_chain_links';
import {encodeSecp256k1Pubkey, makeSignDoc} from '@cosmjs/amino';
import {LedgerSigner} from '@cosmjs/ledger-amino';
import {fromBase64} from '@cosmjs/encoding';
import {encodePubkey} from '@cosmjs/proto-signing';
import LocalWallet from 'lib/LocalWallet';
import {SignDoc, TxBody} from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import Long from 'long';
import {makeProof} from 'screens/ConnectAddress/utils';
import {useNavigation} from '@react-navigation/native';
import ROUTES from 'navigation/routes';
import {useTranslation} from 'react-i18next';

const useGenerateProof = () => {
  const {t} = useTranslation('connectAddress');
  const {navigate, pop} = useNavigation<any>();

  const generateProof = React.useCallback(
    async ({
      externalAccount,
      activeAddress,
    }: {
      externalAccount: ExternalAccount;
      activeAddress: string;
    }): Promise<Proof | undefined> => {
      const {type, signer} = externalAccount;

      if (type === ExternalAccountEnum.ledger) {
        const _signDoc = makeSignDoc(
          [],
          {
            gas: '0',
            amount: [],
          },
          '0',
          activeAddress,
          '0',
          '0',
        );

        const ledgerSigner = signer as LedgerSigner;

        try {
          const [account] = await ledgerSigner.getAccounts();

          navigate(ROUTES.CONFIRM_MODAL, {
            title: t('pleaseReview'),
            subtitle: t('approveTxOnLedger'),
          });

          const {signature} = await ledgerSigner.signAmino(
            account.address,
            _signDoc,
          );

          const proof = makeProof({
            signature: fromBase64(signature.signature),
            pubKey: encodePubkey(encodeSecp256k1Pubkey(account.pubkey)),
            signDoc: _signDoc,
            signingMode: SignatureValueType.SIGNATURE_VALUE_TYPE_COSMOS_AMINO,
          });

          // pop out of the modal before returning the proof
          pop();

          return proof;
        } catch (err) {
          console.log(err);
        }
      } else {
        const localWallet = await LocalWallet.deserialize(signer as string);
        const [account] = await localWallet.getAccounts();

        const _signDoc = SignDoc.fromPartial({
          accountNumber: Long.ZERO,
          authInfoBytes: new Uint8Array(),
          bodyBytes: TxBody.encode(
            TxBody.fromPartial({
              memo: activeAddress,
            }),
          ).finish(),
          chainId: '',
        });

        const {signature} = await localWallet.signDirect(
          account.address,
          _signDoc,
        );

        return makeProof({
          signature: fromBase64(signature.signature),
          pubKey: encodePubkey(encodeSecp256k1Pubkey(account.pubkey)),
          signDoc: _signDoc,
          signingMode: SignatureValueType.SIGNATURE_VALUE_TYPE_COSMOS_DIRECT,
        });
      }
    },
    [],
  );

  return {
    generateProof,
  };
};

export default useGenerateProof;
