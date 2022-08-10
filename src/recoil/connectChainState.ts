import {LinkableChain} from 'types/chains';
import {atom, DefaultValue, selector} from 'recoil';
import {OfflineSigner} from '@cosmjs/proto-signing';

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
    };
  },
  set: ({set}, value) => {
    if (value instanceof DefaultValue) {
      set(selectedChainState, value);
      set(connectMethodState, value);
      set(mnemonicState, value);
      return;
    }
    set(selectedChainState, value.selectedChain);
    set(connectMethodState, value.connectMethod);
    set(mnemonicState, value.mnemonic);
  },
});
