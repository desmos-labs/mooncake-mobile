import React from 'react';
import {GrantEnums} from 'lib/desmos/msgtypes';
import {atom, selector, useRecoilState} from 'recoil';
import _ from 'lodash';

interface BasePendingTx {
  msgType: GrantEnums;

  timestamp: number;

  txHash: string;
}

interface PendingRelationship extends BasePendingTx {
  counterPartyAddr: string;

  msgType: GrantEnums.MsgCreateRelationship | GrantEnums.MsgDeleteRelationship;
}

// future union type
type PendingTx = PendingRelationship;

/**
 * The master atom that contains all pending transactions.
 */
const pendingTransactionsState = atom<PendingTx[]>({
  key: 'pendingTransactionsState',
  default: [],
});

/**
 * A selector that only returns pending transactions related to Creating/Deleting relationships
 */
const pendingRelationships = selector<PendingRelationship[]>({
  key: 'pendingRelationships',
  get: ({get}) => {
    const pendingTransactions = get(pendingTransactionsState);

    return pendingTransactions.filter(
      x =>
        x.msgType === GrantEnums.MsgCreateRelationship ||
        x.msgType === GrantEnums.MsgDeleteRelationship,
    );
  },
});

const usePendingTransactions = () => {
  const [pendingTransactions, setPendingTransaction] = useRecoilState(
    pendingTransactionsState,
  );

  // debug
  React.useEffect(() => {
    console.log('[PENDING TRANSACTIONS]:', pendingTransactions);
  }, [pendingTransactions]);

  /**
   * Add a new pending relationship to recoil state.
   * @param {PendingTx} newRelationship - The new relationship to be added.
   */
  const addNewPendingTx = React.useCallback(
    (newTx: PendingTx) => {
      setPendingTransaction(prev => [...prev, newTx]);
    },
    [pendingTransactions],
  );

  /**
   * Remove a pending transaction by its txHash.
   * @param {string} txHash - The txHash to remove.
   */
  const resolveByTxHash = React.useCallback(
    (txHash: string) => {
      setPendingTransaction(prev => prev.filter(x => x.txHash !== txHash));
    },
    [pendingTransactions],
  );

  /**
   * Remove a pending relationship transaction by counter party address
   * @param {string} counterPartyAddr - The address of the counter party.
   */
  const resolveRelationshipTxByAddr = React.useCallback(
    (counterPartyAddr: string) => {
      // could get expensive as list grows, POC
      setPendingTransaction(prev =>
        _.remove(
          prev,
          x =>
            (x.msgType === GrantEnums.MsgCreateRelationship &&
              x.counterPartyAddr === counterPartyAddr) ||
            (x.msgType === GrantEnums.MsgDeleteRelationship &&
              x.counterPartyAddr === counterPartyAddr),
        ),
      );
    },
    [pendingTransactions],
  );

  return {
    addNewPendingTx,
    resolveByTxHash,
    resolveRelationshipTxByAddr,
  };
};

export default usePendingTransactions;

export {pendingRelationships};
