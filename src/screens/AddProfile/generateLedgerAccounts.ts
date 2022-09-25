import {LedgerSigner} from '@cosmjs/ledger-amino';
import {toCosmjsHdPath} from 'lib/FormatUtils';
import {ChainAccount, ChainAccountType} from 'types/chains';
import desmosChain from './desmosChain';

/**
 * @param {number} addressIndexOffset - The starting index of the address.
 * @param {LedgerSigner} signer - OfflineSigner
 * @returns An array of 100 ChainAccounts.
 */
export async function generateLedgerAccounts(
  addressIndexOffset: number,
  numOfAccounts: number,
  signer: LedgerSigner,
): Promise<ChainAccount[]> {
  /* Creating an array of 100 items with the value of 0. */
  const items = new Array(numOfAccounts).fill(0);

  const accounts = await signer.getAccounts();
  if (!accounts.length) return [];

  return Promise.all(
    items.map(async (_, addressIndex) => {
      const hdPath = {
        ...desmosChain().hdPath,
        addressIndex: addressIndexOffset + addressIndex,
      };
      const {address, pubkey} = await signer.showAddress(
        toCosmjsHdPath(hdPath),
      );
      return {
        type: ChainAccountType.Ledger,
        address,
        hdPath,
        pubKey: pubkey.value,
        signAlgorithm: accounts[0].algo,
      };
    }),
  );
}

export default generateLedgerAccounts;
