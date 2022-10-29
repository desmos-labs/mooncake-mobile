import BluetoothTransport from '@ledgerhq/react-native-hw-transport-ble';
import {HdPath} from 'types/hdpath';
import {toCosmjsHdPath} from 'lib/FormatUtils';
import {LedgerSigner} from '@cosmjs/ledger-amino';
import LocalWallet from 'lib/LocalWallet';
import {ExternalAccountEnum} from '@recoil/connectChainState';

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
