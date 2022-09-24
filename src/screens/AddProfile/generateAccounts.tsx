import {OfflineSigner} from '@cosmjs/proto-signing';
import generateLocalAccounts from './generateLocalAccounts';
import generateLedgerAccounts from './generateLedgerAccounts';
import isLedgerSigner from './isLedgerSigner';
import {PROFILE_PER_PAGE} from '.';

/**
 * It generates a list of accounts based on the page number, the signer, and the mnemonic
 * @param {number} page - The page number of the accounts to generate.
 * @param {OfflineSigner} signer - OfflineSigner - this is the signer that the user has selected.
 * @param {string | undefined} mnemonic - The mnemonic phrase used to generate the accounts.
 * @returns An array of accounts
 */
function generateAccounts(
  page: number,
  signer: OfflineSigner,
  mnemonic: string | undefined,
) {
  const addressIndexOffset = page * PROFILE_PER_PAGE;
  if (isLedgerSigner(signer)) {
    return generateLedgerAccounts(addressIndexOffset, PROFILE_PER_PAGE, signer);
  }
  return generateLocalAccounts(addressIndexOffset, PROFILE_PER_PAGE, mnemonic);
}

export default generateAccounts;
