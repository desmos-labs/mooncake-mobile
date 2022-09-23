import {toBase64} from '@cosmjs/encoding';
import LocalWallet from 'lib/LocalWallet';
import {ChainAccount, ChainAccountType} from 'types/chains';
import {PROFILE_PER_PAGE} from './index';
import desmosChain, {DESMOS_PREFIX} from './desmosChain';

/**
 * @param {number} addressIndexOffset - The index of the first address to be generated.
 * @param signAlgorithm - The algorithm used to sign the transaction.
 * @param {string} [mnemonic] - The mnemonic that will be used to generate the accounts.
 * @returns An array of 100 items with the value of 0.
 */
async function generateLocalAccounts(
  addressIndexOffset: number,
  signAlgorithm: ChainAccount['signAlgorithm'],
  mnemonic?: string,
): Promise<ChainAccount[]> {
  /* If the mnemonic is not provided, then the function will return an empty array. */
  if (!mnemonic) {
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
      const wallet = await LocalWallet.fromMnemonic(mnemonic, {
        prefix: DESMOS_PREFIX,
        hdPath,
      });
      return {
        type: ChainAccountType.Local,
        address: wallet.bech32Address,
        hdPath,
        pubKey: toBase64(wallet.publicKey),
        signAlgorithm,
      };
    }),
  );
}

export default generateLocalAccounts;
