import {LinkableChain} from 'types/chains';
import {atom, DefaultValue, selector} from 'recoil';
import {OfflineSigner} from '@cosmjs/proto-signing';
import {HdPath} from 'types/hdpath';
import {LedgerSigner} from '@cosmjs/ledger-amino';
import BluetoothTransport from '@ledgerhq/react-native-hw-transport-ble';

export enum ExternalAccountEnum {
  'mnemonic',
  'ledger',
}

export interface ExternalAccount {
  signer: string | LedgerSigner;
  address: string;
  hdPath: HdPath;
  type: ExternalAccountEnum;
}

export const selectedChainState = atom<LinkableChain>({
  key: 'selectedChain',
  default: undefined,
});

export const connectMethodState = atom<'LEDGER' | 'PASSWORD'>({
  key: 'connectMethod',
  default: undefined,
});

export const signerState = atom<OfflineSigner>({
  key: 'signer',
  default: undefined,
});

export const mnemonicState = atom<string>({
  key: 'mnemonic',
  default: undefined,
});

export const selectedExternalAccountState = atom<ExternalAccount>({
  key: 'selectedExternalAccount',
  default: undefined,
});

export const ledgerTransportState = atom<BluetoothTransport>({
  key: 'bleLedger',
  default: undefined,
});

export const ledgerAppState = atom<LedgerApp>({
  key: 'ledgerApp',
  default: undefined,
});

/**
 * An atom to keep track of the data used to create a new chain
 * connection
 */
export const connectChainState = selector({
  key: 'connectChain',
  get: ({get}) => {
    return {
      selectedChain: get(selectedChainState),
      connectMethod: get(connectMethodState),
      mnemonic: get(mnemonicState),
      selectedExternalAccount: get(selectedExternalAccountState),
      ledgerTransport: get(ledgerTransportState),
      ledgerApp: get(ledgerAppState),
    };
  },
  set: ({set}, value) => {
    if (value instanceof DefaultValue) {
      set(selectedChainState, value);
      set(connectMethodState, value);
      set(mnemonicState, value);
      set(selectedExternalAccountState, value);
      set(ledgerTransportState, value);
      set(ledgerAppState, value);
      return;
    }
    set(selectedChainState, value.selectedChain);
    set(connectMethodState, value.connectMethod);
    set(mnemonicState, value.mnemonic);
    set(selectedExternalAccountState, value.selectedExternalAccount);
    set(ledgerTransportState, value.ledgerTransport);
    set(ledgerAppState, value.ledgerApp);
  },
});
