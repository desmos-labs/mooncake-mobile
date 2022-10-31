import BluetoothTransport from '@ledgerhq/react-native-hw-transport-ble';
import {HdPath} from 'types/hdpath';
import {toCosmjsHdPath} from 'lib/FormatUtils';
import {LedgerSigner} from '@cosmjs/ledger-amino';
import LocalWallet from 'lib/LocalWallet';
import {ExternalAccount, ExternalAccountEnum} from '@recoil/connectChainState';
import {
  Proof,
  SignatureValueType,
  SingleSignature,
} from '@desmoslabs/desmjs-types/desmos/profiles/v3/models_chain_links';
import {isStdSignDoc} from '@desmoslabs/desmjs';
import {Any} from '@desmoslabs/desmjs-types/google/protobuf/any';
import {fromBase64, toHex} from '@cosmjs/encoding';
import {TxBody, SignDoc} from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import {
  encodeSecp256k1Pubkey,
  makeSignDoc,
  serializeSignDoc,
  StdSignDoc,
} from '@cosmjs/amino';
import {encodePubkey} from '@cosmjs/proto-signing';
import Long from 'long';

export const generateAccountUsingMnemonic = async ({
  prefix,
  hdPaths,
  mnemonic,
}: {
  prefix: string;
  hdPaths: HdPath[];
  mnemonic: string;
}) => {
  const generateWallets = hdPaths.map(x =>
    LocalWallet.fromMnemonic(mnemonic, {
      prefix,
      hdPath: x,
    }),
  );

  const wallets = await Promise.all(generateWallets);

  return wallets.map((x, idx) => ({
    signer: x.serialize(),
    address: x.bech32Address,
    hdPath: hdPaths[idx],
    type: ExternalAccountEnum.mnemonic,
  }));
};

export const generateAccountUsingLedger = async ({
  ledgerTransport,
  ledgerApp,
  prefix,
  hdPaths,
}: {
  ledgerTransport: BluetoothTransport;
  ledgerApp: LedgerApp;
  prefix: string;
  hdPaths: HdPath[];
}) => {
  const cosmJsPaths = hdPaths.map(toCosmjsHdPath);

  const {name: ledgerAppName, minVersion: minLedgerAppVersion} = ledgerApp;

  const ledgerSigner = new LedgerSigner(ledgerTransport, {
    ledgerAppName,
    minLedgerAppVersion,
    hdPaths: cosmJsPaths,
    prefix,
  });

  const accounts = await ledgerSigner.getAccounts();

  return accounts.map((x, idx) => ({
    signer: ledgerSigner,
    address: x.address,
    hdPath: hdPaths[idx],
    type: ExternalAccountEnum.ledger,
  }));
};

export const generateHdPaths = ({
  startingIndex,
  limit = 20,
  coinType,
}: {
  startingIndex: number;
  limit?: number;
  coinType: number;
}): HdPath[] =>
  new Array(limit).fill(0).map((_, idx) => {
    return {
      coinType,
      change: 0,
      account: 0,
      addressIndex: startingIndex + idx,
    };
  });

const makeProof = ({
  signature,
  pubKey,
  signDoc,
  signingMode,
}: {
  signature: Uint8Array;
  pubKey: {
    typeUrl?: string | undefined;
    value?: Uint8Array | undefined;
  };
  signDoc: StdSignDoc | SignDoc;
  signingMode: SignatureValueType;
}) => {
  const _signature: SingleSignature = {
    valueType: signingMode,
    signature,
  };
  const proof: Proof = Proof.fromPartial({
    pubKey,
    signature: Any.fromPartial({
      typeUrl: '/desmos.profiles.v3.SingleSignature',
      value: SingleSignature.encode(_signature).finish(),
    }),
    plainText: isStdSignDoc(signDoc)
      ? toHex(serializeSignDoc(signDoc))
      : toHex(SignDoc.encode(signDoc).finish()),
  });

  return proof;
};

export const generateProof = async ({
  externalAccount,
  activeAddress,
}: {
  externalAccount: ExternalAccount;
  activeAddress: string;
}): Promise<Proof> => {
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

    const [account] = await ledgerSigner.getAccounts();

    const {signature} = await ledgerSigner.signAmino(account.address, _signDoc);

    return makeProof({
      signature: fromBase64(signature.signature),
      pubKey: encodePubkey(encodeSecp256k1Pubkey(account.pubkey)),
      signDoc: _signDoc,
      signingMode: SignatureValueType.SIGNATURE_VALUE_TYPE_COSMOS_AMINO,
    });
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

    const {signature} = await localWallet.signDirect(account.address, _signDoc);

    return makeProof({
      signature: fromBase64(signature.signature),
      pubKey: encodePubkey(encodeSecp256k1Pubkey(account.pubkey)),
      signDoc: _signDoc,
      signingMode: SignatureValueType.SIGNATURE_VALUE_TYPE_COSMOS_DIRECT,
    });
  }
};
