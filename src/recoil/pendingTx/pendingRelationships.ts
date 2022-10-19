import React from 'react';
import {GrantEnums} from 'lib/desmos/msgtypes';
import {atom, useRecoilState} from 'recoil';
import _ from 'lodash';

/**
 * A selector that only returns pending transactions related to Creating/Deleting relationships
 */
export const pendingRelationshipsState = atom<PendingRelationship[]>({
  key: 'pendingRelationships',
  default: [],
});

const usePendingRelationships = () => {
  const [pendingRelationships, setPendingRelationships] = useRecoilState(
    pendingRelationshipsState,
  );

  /**
   * Add a new pending relationship to recoil state.
   * @param {PendingTx} newRelationship - The new relationship to be added.
   */
  const addNewPendingRelationship = React.useCallback(
    (newTx: PendingRelationship) => {
      setPendingRelationships(prev => [...prev, newTx]);
    },
    [pendingRelationships],
  );

  /**
   * Compare and remove any pending relationship tx with incoming data.
   *
   * @param {string[]} newFollowing - An array of addresses the use is currently following
   */
  const syncPendingRelationships = React.useCallback(
    (newFollowingAddrs: string[]) => {
      setPendingRelationships(prev =>
        prev.filter(
          x =>
            (x.msgType === GrantEnums.MsgCreateRelationship &&
              !newFollowingAddrs.includes(x.counterPartyAddr)) ||
            (x.msgType === GrantEnums.MsgDeleteRelationship &&
              newFollowingAddrs.includes(x.counterPartyAddr)),
        ),
      );
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
   * @param {GrantEnums.MsgCreateRelationship | GrantEnums.MsgDeleteRelationship}
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

  /**
   * Check if a given address has a pending relationship related transaction.
   * @param {string} address - The address to check.
   */
  const checkIfAddressIsPendingRelationship = React.useCallback(
    (address: string) => {
      return !!pendingRelationships.find(x => x.counterPartyAddr === address);
    },
    [pendingRelationships],
  );

  return {
    addNewPendingRelationship,
    resolveByTxHash,
    resolveRelationshipTxByAddr,
    syncPendingRelationships,
    checkIfAddressIsPendingRelationship,
  };
};

export default usePendingRelationships;
