import React from 'react';
import {ExternalAccount, ExternalAccountEnum} from '@recoil/connectChainState';
import {
  DesmosClient,
  isStdSignDoc,
  OfflineSignerAdapter,
  Signer,
} from '@desmoslabs/desmjs';
import LocalWallet from 'lib/LocalWallet';
import EnvConfig from 'config/EnvConfig';
import {LedgerSigner} from '@cosmjs/ledger-amino';
import {
  Proof,
  SignatureValueType,
  SingleSignature,
} from '@desmoslabs/desmjs-types/desmos/profiles/v3/models_chain_links';
import {Any} from '@desmoslabs/desmjs-types/google/protobuf/any';
import {toHex} from '@cosmjs/encoding';
import {SignDoc} from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import {serializeSignDoc, StdSignDoc} from '@cosmjs/amino';

const useGenerateProof = () => {
  const generateProof = React.useCallback(
    async ({
      externalAccount,
      activeAddress,
    }: {
      externalAccount: ExternalAccount;
      activeAddress: string;
    }): Promise<Proof> => {
      const {address, type, signer} = externalAccount;

      let externalSigner: Signer;

      if (type === ExternalAccountEnum.ledger) {
        externalSigner = new OfflineSignerAdapter(signer as LedgerSigner);
      } else {
        externalSigner = new OfflineSignerAdapter(
          await LocalWallet.deserialize(signer as string),
        );
      }

      if (!externalSigner) throw new Error('Error parsing signer');

      const client = await DesmosClient.connectWithSigner(
        EnvConfig.DESMOS_RPC,
        externalSigner,
      );

      const {pubKey, txRaw, signDoc} = await client.signTx(
        address,
        [],
        {
          gas: '0',
          amount: [],
        },
        activeAddress,
      );

      const signature: SingleSignature = {
        valueType: SignatureValueType.SIGNATURE_VALUE_TYPE_COSMOS_DIRECT, // Proper signature type
        signature: txRaw.signatures[0], // Signature value
      };
      const proof: Proof = Proof.fromPartial({
        pubKey,
        signature: Any.fromPartial({
          typeUrl: '/desmos.profiles.v3.SingleSignature',
          value: SingleSignature.encode(signature).finish(),
        }),
        plainText: toHex(SignDoc.encode(signDoc as SignDoc).finish()),
      });

      client.disconnect();

      console.log('im proof', proof);
      return proof;
    },
    [],
  );

  const generateProofCompat = React.useCallback(
    async ({
      externalAccount,
      activeAddress,
    }: {
      externalAccount: ExternalAccount;
      activeAddress: string;
    }): Promise<Proof> => {
      const {address, signer} = externalAccount;

      const client = await DesmosClient.connectWithSigner(
        EnvConfig.DESMOS_RPC,
        new OfflineSignerAdapter(signer as LedgerSigner),
      );

      const result = await client.signTx(
        address,
        [],
        {
          gas: '0',
          amount: [],
        },
        activeAddress,
      );

      const {txRaw, pubKey, signDoc} = result;

      console.log('is std sign doc', isStdSignDoc(signDoc));

      const signature: SingleSignature = {
        valueType: SignatureValueType.SIGNATURE_VALUE_TYPE_COSMOS_AMINO, // Proper signature type
        signature: txRaw.signatures[0], // Signature value
      };

      const proof: Proof = Proof.fromPartial({
        pubKey,
        signature: Any.fromPartial({
          typeUrl: '/desmos.profiles.v3.SingleSignature',
          value: SingleSignature.encode(signature).finish(),
        }),
        plainText: toHex(serializeSignDoc(signDoc as StdSignDoc)),
      });

      client.disconnect();

      console.log('im proof', proof);
      return proof;
    },
    [],
  );

  return {
    generateProof,
    generateProofCompat,
  };
};

export default useGenerateProof;
