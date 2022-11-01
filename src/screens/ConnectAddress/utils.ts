import BluetoothTransport from '@ledgerhq/react-native-hw-transport-ble';
import {HdPath} from 'types/hdpath';
import {toCosmjsHdPath} from 'lib/FormatUtils';
import {LedgerSigner} from '@cosmjs/ledger-amino';
import LocalWallet from 'lib/LocalWallet';
import {ExternalAccountEnum} from '@recoil/connectChainState';
import {
  Proof,
  SignatureValueType,
  SingleSignature,
} from '@desmoslabs/desmjs-types/desmos/profiles/v3/models_chain_links';
import {isStdSignDoc} from '@desmoslabs/desmjs';
import {Any} from '@desmoslabs/desmjs-types/google/protobuf/any';
import {toHex} from '@cosmjs/encoding';
import {SignDoc} from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import {serializeSignDoc, StdSignDoc} from '@cosmjs/amino';
import _ from 'lodash';

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

export const generateAccountUsingLedger = _.debounce(
  async ({
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
  },
  2000,
);

export const generateHdPaths = ({
  startingIndex,
  limit = 20,
  coinType,
}: {
  startingIndex: number;
  limit?: number;
  coinType: number;
}): HdPath[] =>
  new Array(limit).fill(0).map((_el, idx) => {
    return {
      coinType,
      change: 0,
      account: 0,
      addressIndex: startingIndex + idx,
    };
  });

export const makeProof = ({
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
