import { LedgerSigner } from '@cosmjs/ledger-amino';
import { OfflineSigner } from '@cosmjs/proto-signing';

/**
 * If the signer has a showAddress function, then it's a LedgerSigner.
 * @param {OfflineSigner} signer - OfflineSigner - The signer to check
 * @returns A boolean
 */
function isLedgerSigner(signer: OfflineSigner | undefined): signer is LedgerSigner {
  return !!signer && typeof (signer as LedgerSigner).showAddress === 'function';
}

export default isLedgerSigner;
