import React from 'react';
import { useActiveAccountAddress } from '@recoil/accounts';
import { EncodeObject } from '@cosmjs/proto-signing';
import {
  useGetCreatedRelationshipToSync,
  useGetDeletedRelationshipToSync,
} from '@recoil/relationships';
import { Relationships } from '@desmoslabs/desmjs';
import { FollowedUser } from 'types/relationships';
import { CachedDataUpdate, CachedDataUpdateType } from 'lib/CacheUtils';
import useUpdatePendingRelationships from 'hooks/relationships/useUpdatePendingRelationships';
import { DataStatus } from 'types/cache';

interface RelationshipData {
  readonly msgType: typeof Relationships.v1.MsgCreateRelationshipTypeUrl | typeof Relationships.v1.MsgDeleteRelationshipTypeUrl;
  readonly relationship: FollowedUser;
}

/**
 * Function that retrieves the proper relationship data from the given messages.
 */
const useGetRelationshipsData = () => {
  const getCreatedRelationshipToSync = useGetCreatedRelationshipToSync();
  const getDeletedRelationshipToSync = useGetDeletedRelationshipToSync();

  return React.useCallback(
    (messages: EncodeObject[]) => {
      return messages
        .map(msg => {
          switch (msg.typeUrl) {
            // Handle pending MsgCreateRelationshipTypeUrl messages
            case Relationships.v1.MsgCreateRelationshipTypeUrl: {
              const value = msg.value as Relationships.v1.MsgCreateRelationshipEncodeObject['value'];
              return {
                msgType: Relationships.v1.MsgCreateRelationshipTypeUrl,
                relationship: getCreatedRelationshipToSync(value.signer, value.counterparty),
              };
            }

            // Handle pending MsgUnfollow messages
            case Relationships.v1.MsgDeleteRelationshipTypeUrl: {
              const value = msg.value as Relationships.v1.MsgDeleteRelationshipEncodeObject['value'];
              return {
                msgType: Relationships.v1.MsgDeleteRelationshipTypeUrl,
                relationship: getDeletedRelationshipToSync(value.signer, value.counterparty),
              };
            }

            // Handle other messages
            default:
              return undefined;
          }
        })
        .filter(
          (data): data is RelationshipData => data !== undefined && data.relationship !== undefined,
        );
    },
    [getCreatedRelationshipToSync, getDeletedRelationshipToSync],
  );
};

/**
 * Hook that allows to retrieve the relationships update for the given user.
 */

const useGetRelationshipsUpdate = () => {
  return React.useCallback((data: RelationshipData) => {
    switch (data.msgType) {
      // Handle MsgCreateRelationshipTypeUrl messages
      case Relationships.v1.MsgCreateRelationshipTypeUrl: {
        return {
          type: CachedDataUpdateType.UPDATED,
          original: data.relationship,
          updated: {
            ...data.relationship,
            status: DataStatus.SYNCED,
          },
        } as CachedDataUpdate<FollowedUser>;
      }

      // Handle MsgDeleteRelationshipTypeUrl messages
      case Relationships.v1.MsgDeleteRelationshipTypeUrl: {
        return {
          type: CachedDataUpdateType.DELETED,
          data: data.relationship,
        } as CachedDataUpdate<FollowedUser>;
      }
    }
  }, []);
};

/**
 * Hook that allows to handle the messages of a transaction that are related to the relationships module.
 */
const useHandleRelationshipsMessages = () => {
  const activeAddress = useActiveAccountAddress();

  const getRelationshipsData = useGetRelationshipsData();
  const getRelationshipsUpdate = useGetRelationshipsUpdate();
  const updatePendingRelationships = useUpdatePendingRelationships();

  return React.useCallback(
    async (messages: EncodeObject[]) => {
      if (!activeAddress) {
        throw new Error('Trying to handle relationships messages without an active account');
      }

      const relationshipsData = getRelationshipsData(messages);
      const updates = relationshipsData.map(getRelationshipsUpdate);
      updatePendingRelationships(activeAddress, updates);
    },
    [activeAddress, getRelationshipsData, getRelationshipsUpdate, updatePendingRelationships],
  );
};

export default useHandleRelationshipsMessages;
