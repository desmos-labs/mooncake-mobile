import { toHex } from '@cosmjs/encoding';
import { SignerData } from '@cosmjs/stargate';
import {
  getPubKeyRawBytes,
  getSignatureBytes,
  getSignedBytes,
  SigningMode,
  StdFee,
  Profiles,
} from '@desmoslabs/desmjs';
import {
  Bech32Address,
  Proof,
  SignatureValueType,
  SingleSignature,
} from '@desmoslabs/desmjs-types/desmos/profiles/v3/models_chain_links';
import { Any } from '@desmoslabs/desmjs-types/google/protobuf/any';
import { useActiveAccount } from '@recoil/accounts';
import { useStoreUserChainLinks } from '@recoil/chainLinks';
import LinkableChains from 'config/LinkableChains';
import { PubKey } from 'cosmjs-types/cosmos/crypto/secp256k1/keys';
import useImportAccount from 'hooks/accounts/useImportAccount';
import useReturnToCurrentScreen from 'hooks/navigation/useReturnToCurrentScreen';
import useBroadcastTx from 'hooks/transactions/useBroadcastTx';
import useSignTx from 'hooks/transactions/useSignTx';
import { getAddress } from 'lib/ChainsUtils';
import { err, ok, Result } from 'neverthrow';
import React from 'react';
import { Account, AccountWithWallet, SelectedAccount } from 'types/account';
import { SupportedChain } from 'types/chains';
import { ChainLink } from 'types/desmos';

/**
 * Hook used to generate the proof used to link an external wallet to a Desmos Profile.
 */
const useGenerateProof = () => {
  const signTx = useSignTx();

  return React.useCallback(
    async (account: Account, externalAccount: AccountWithWallet, chain: SupportedChain) => {
      const fees: StdFee = {
        gas: '0',
        amount: [],
      };
      const signerData: SignerData = {
        accountNumber: 0,
        chainId: chain.name,
        sequence: 0,
      };

      const signResult = await signTx(externalAccount.wallet, {
        messages: [],
        fees,
        signerData,
        memo: account.address,
      });

      if (signResult.isErr()) {
        return err(signResult.error);
      }

      const { signatureResult } = signResult.value;
      const pubKeyBytes = getPubKeyRawBytes(signatureResult);
      const signatureBytes = getSignatureBytes(signatureResult);
      const signedBytes = getSignedBytes(signatureResult);

      const proofPlainText = toHex(signedBytes);
      const proofSignature = Profiles.v3.singleSignatureToAny(
        SingleSignature.fromPartial({
          valueType:
            externalAccount.wallet.signer.signingMode === SigningMode.DIRECT
              ? SignatureValueType.SIGNATURE_VALUE_TYPE_COSMOS_DIRECT
              : SignatureValueType.SIGNATURE_VALUE_TYPE_COSMOS_AMINO,
          signature: signatureBytes,
        }),
      );
      const proofPubKey = Any.fromPartial({
        typeUrl: '/cosmos.crypto.secp256k1.PubKey',
        value: PubKey.encode(
          PubKey.fromPartial({
            key: pubKeyBytes,
          }),
        ).finish(),
      });

      return ok(
        Proof.fromPartial({
          signature: proofSignature,
          plainText: proofPlainText,
          pubKey: proofPubKey,
        }),
      );
    },
    [signTx],
  );
};

/**
 * Hook used to generate a MsgLinkChainAccount message used to link an external chain to a Desmos Profile.
 */
const useGenerateMsgLinkChainAccount = () => {
  const generateProof = useGenerateProof();
  const activeAccount = useActiveAccount();

  return React.useCallback(
    async (externalAccount: AccountWithWallet, chain: SupportedChain) => {
      if (!activeAccount) {
        return err(Error('No active account'));
      }

      const address = getAddress(chain, externalAccount);
      return (await generateProof(activeAccount, externalAccount, chain)).map(proof => {
        return {
          typeUrl: Profiles.v3.MsgLinkChainAccountTypeUrl,
          value: {
            proof,
            chainConfig: chain.chainConfig,
            signer: activeAccount.address,
            chainAddress: address,
          },
        } as Profiles.v3.MsgLinkChainAccountEncodeObject;
      });
    },
    [generateProof, activeAccount],
  );
};

const useSaveChainLinkAccount = () => {
  const storeChainLinks = useStoreUserChainLinks();
  return React.useCallback(
    (message: Profiles.v3.MsgLinkChainAccountEncodeObject) => {
      const address = Bech32Address.decode(message.value.chainAddress!.value);
      const signature = SingleSignature.decode(message.value.proof!.signature!.value);

      const chainLinks: ChainLink = {
        userAddress: message.value.signer,
        chainName: message.value.chainConfig!.name,
        externalAddress: address.value,
        proof: {
          signature: toHex(signature.signature),
          plainText: message.value.proof!.plainText,
        },
        creationTime: new Date(Date.now()),
      };

      storeChainLinks(message.value.signer, [chainLinks], true);
    },
    [storeChainLinks],
  );
};

/**
 * Hook used to start the connection to an external chain.
 * @param userChainLinks - Current user's chain links.
 */
const useConnectChain = (userChainLinks: ChainLink[]) => {
  const returnToCurrentScreen = useReturnToCurrentScreen();
  const ignoreAddresses = React.useMemo(
    () => userChainLinks.map(({ externalAddress }) => externalAddress),
    [userChainLinks],
  );
  const importAccount = useImportAccount({
    chains: LinkableChains,
    ignoreAddresses,
  });
  const generateMsgChainLink = useGenerateMsgLinkChainAccount();
  const broadcastTx = useBroadcastTx();
  const saveChainLink = useSaveChainLinkAccount();

  return React.useCallback(async (): Promise<Result<void, Error>> => {
    const accountWithChain = await new Promise<
      { account: SelectedAccount; chain: SupportedChain } | undefined
    >(resolve => {
      importAccount({
        onSelect: (account: SelectedAccount, chain) => {
          returnToCurrentScreen();
          resolve({ account, chain });
        },
        onCancel: () => resolve(undefined),
      });
    });

    if (accountWithChain !== undefined) {
      const { account, chain } = accountWithChain;
      const generateMsgResult = await generateMsgChainLink(account, chain);
      if (generateMsgResult.isErr()) {
        return err(generateMsgResult.error);
      }

      const txResult = await broadcastTx([generateMsgResult.value], {
        onChain: true,
      });

      if (txResult.isErr()) {
        return err(txResult.error);
      }

      saveChainLink(generateMsgResult.value);
      return ok(undefined);
    } else {
      return ok(undefined);
    }
  }, [broadcastTx, generateMsgChainLink, importAccount, returnToCurrentScreen, saveChainLink]);
};

export default useConnectChain;
