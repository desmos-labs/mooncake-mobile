import {LedgerSigner} from '@cosmjs/ledger-amino';
import {OfflineSigner} from '@cosmjs/proto-signing';
import {toCosmjsHdPath} from 'lib/FormatUtils';
import {ChainAccount, ChainAccountType} from 'types/chains';
import {PROFILE_PER_PAGE} from './index';
import desmosChain from './desmosChain';

/**
 * @param {number} addressIndexOffset - The starting index of the address.
 * @param signAlgorithm - The algorithm used to sign the transaction.
 * @param {OfflineSigner} signer - OfflineSigner
 * @returns An array of 100 ChainAccounts.
 */
async function generateLedgerAccounts(
  addressIndexOffset: number,
  signAlgorithm: ChainAccount['signAlgorithm'],
  signer: OfflineSigner,
): Promise<ChainAccount[]> {
  /* Checking if the signer is a LedgerSigner. */
  if (!isLedgerSigner(signer)) {
    return [];
  }

  /* Creating an array of 100 items with the value of 0. */
  const items = new Array(PROFILE_PER_PAGE).fill(0);

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
        signAlgorithm,
      };
    }),
  );
}
/**
 * If the signer has a showAddress function, then it's a LedgerSigner.
 * @param {OfflineSigner} signer - OfflineSigner - The signer to check
 * @returns A boolean
 */
function isLedgerSigner(signer: OfflineSigner): signer is LedgerSigner {
  return typeof (signer as LedgerSigner).showAddress === 'function';
}

export default generateLedgerAccounts;
