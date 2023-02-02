import { useRecoilValue } from 'recoil';
import pendingTxState from '@recoil/pendingTx/pendingTxState';

/**
 * A hook for finding pending transaction data from recoil.
 */
const useFindPendingTx = () => {
  const pendingTx = useRecoilValue(pendingTxState);

  /**
   * Get a pending transaction by its transaction hash.
   * @param {string} txHash - The transaction hash to search for.
   * @returns {PendingTx|undefined} - A matching pending transaction or undefined if no result is found.
   */
  const findPendingTxByHash = (txHash: string): PendingTx | undefined => {
    return pendingTx.find(x => x.txHash === txHash);
  };

  return {
    findPendingTxByHash,
  };
};

export default useFindPendingTx;
