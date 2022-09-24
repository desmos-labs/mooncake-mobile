import {OfflineSigner} from '@cosmjs/proto-signing';
import {Dispatch, SetStateAction} from 'react';
import {ChainAccount, ChainAccountType} from 'types/chains';
import generateLocalAccounts from './generateLocalAccounts';
import generateLedgerAccounts from './generateLedgerAccounts';

/* The number of profiles that will be displayed on the screen. */
export const PROFILE_PER_PAGE = 100;

/**
 * It generates a bunch of accounts, and then updates the state to reflect that
 * @param {ChainAccount} chainAccount - ChainAccount
 * @param {OfflineSigner} signer - OfflineSigner
 * @param {string | undefined} mnemonic - The mnemonic phrase used to generate the accounts.
 * @param accountsByPage - Array<ChainAccount[]>
 * @param setAccountsByPage - Dispatch<SetStateAction<Array<ChainAccount[]>>>,
 * @param setProfileCountByPage - Dispatch<
 */
async function generateAccounts(
  signer: OfflineSigner,
  mnemonic: string | undefined,
  accountType: ChainAccountType,
  signAlgorithm: ChainAccount['signAlgorithm'],
  accountsByPage: Array<ChainAccount[]>,
  setAccountsByPage: Dispatch<SetStateAction<Array<ChainAccount[]>>>,
  setProfileCountByPage: Dispatch<SetStateAction<Record<number, number>>>,
) {
  const page = accountsByPage.length;
  const addressIndexOffset = page * PROFILE_PER_PAGE;
  let newAccounts: Array<ChainAccount> = [];
  if (accountType === ChainAccountType.Local) {
    newAccounts = await generateLocalAccounts(
      addressIndexOffset,
      PROFILE_PER_PAGE,
      signAlgorithm,
      mnemonic,
    );
  } else {
    newAccounts = await generateLedgerAccounts(
      addressIndexOffset,
      PROFILE_PER_PAGE,
      signAlgorithm,
      signer,
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
