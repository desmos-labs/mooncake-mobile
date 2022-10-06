import React from 'react';
import {GrantEnums} from 'lib/desmos/msgtypes';
import {atom, useRecoilState, useRecoilValue} from 'recoil';
import _ from 'lodash';
import {followedAddressesState} from '@recoil/following';

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
 * A selector that only returns pending transactions related to Creating/Deleting relationships
 */
const pendingRelationshipsState = atom<PendingRelationship[]>({
  key: 'pendingRelationships',
  default: [],
});

const usePendingTransactions = () => {
  const followedAddresses = useRecoilValue(followedAddressesState);
  const [pendingRelationships, setPendingRelationships] = useRecoilState(
    pendingRelationshipsState,
  );

  // Clear pending relationship transactions
  React.useEffect(() => {
    setPendingRelationships(prev =>
      prev.filter(
        x =>
          (x.msgType === GrantEnums.MsgCreateRelationship &&
            !followedAddresses.has(x.counterPartyAddr)) ||
          (x.msgType === GrantEnums.MsgDeleteRelationship &&
            followedAddresses.has(x.counterPartyAddr)),
      ),
    );
  }, [followedAddresses]);

  /**
   * Add a new pending relationship to recoil state.
   * @param {PendingTx} newRelationship - The new relationship to be added.
   */
  const addNewPendingRelationship = React.useCallback(
    (newTx: PendingTx) => {
      setPendingRelationships(prev => [...prev, newTx]);
    },
    [pendingRelationships],
  );

  /**
   * Remove a pending relationship by its txHash.
   * @param {string} txHash - The txHash to remove.
   */
  const resolveByTxHash = React.useCallback(
    (txHash: string) => {
      setPendingRelationships(prev => prev.filter(x => x.txHash !== txHash));
    },
    [pendingRelationships],
  );

  /**
   * Remove a pending relationship transaction by counter party address
   * @param {string} counterPartyAddr - The address of the counter party.
   */
  const resolveRelationshipTxByAddr = React.useCallback(
    (
      counterPartyAddr: string,
      type: GrantEnums.MsgCreateRelationship | GrantEnums.MsgDeleteRelationship,
    ) => {
      // could get expensive as list grows, POC
      setPendingRelationships(prev =>
        _.remove(
          prev,
          x => x.msgType === type && x.counterPartyAddr === counterPartyAddr,
        ),
      );
    },
    [pendingRelationships],
  );

  return {
    addNewPendingRelationship,
    resolveByTxHash,
    resolveRelationshipTxByAddr,
  };
};

export default usePendingTransactions;

export {pendingRelationshipsState};
