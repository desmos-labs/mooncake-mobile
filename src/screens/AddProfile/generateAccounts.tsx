import {OfflineSigner} from '@cosmjs/proto-signing';
import {Dispatch, SetStateAction} from 'react';
import {ChainAccount} from 'types/chains';
import generateLocalAccounts from './generateLocalAccounts';
import generateLedgerAccounts from './generateLedgerAccounts';
import isLedgerSigner from './isLedgerSigner';
import {PROFILE_PER_PAGE} from '.';

/**
 * It generates a bunch of accounts, and then updates the state to reflect that
 * @param {OfflineSigner} signer - OfflineSigner
 * @param {string | undefined} mnemonic - The mnemonic phrase used to generate the accounts.
 * @param accountsByPage - Array<ChainAccount[]>
 * @param setAccountsByPage - Dispatch<SetStateAction<Array<ChainAccount[]>>>,
 * @param setProfileCountByPage - Dispatch<
 */
async function generateAccounts(
  signer: OfflineSigner,
  mnemonic: string | undefined,
  accountsByPage: Array<ChainAccount[]>,
  setAccountsByPage: Dispatch<SetStateAction<Array<ChainAccount[]>>>,
  setProfileCountByPage: Dispatch<SetStateAction<Record<number, number>>>,
) {
  const page = accountsByPage.length;
  const addressIndexOffset = page * PROFILE_PER_PAGE;
  let newAccounts: Array<ChainAccount> = [];
  if (isLedgerSigner(signer)) {
    newAccounts = await generateLedgerAccounts(
      addressIndexOffset,
      PROFILE_PER_PAGE,
      signer,
    );
  } else {
    newAccounts = await generateLocalAccounts(
      addressIndexOffset,
      PROFILE_PER_PAGE,
      mnemonic,
    );
  }
  setAccountsByPage(prev => {
    const result = prev.slice();
    if (result.length !== page) {
      result.length = page;
    }
    return result.concat([newAccounts]);
  });
  setProfileCountByPage(prev => ({...prev, [page]: 0}));
}

export default generateAccounts;
