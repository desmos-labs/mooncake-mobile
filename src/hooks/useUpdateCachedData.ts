import { useCallback } from 'react';
import { CacheableObject, DataStatus } from 'types/cache';

/**
 * Hook that is used in order to update a generic {@link CacheableObject} related status.
 */
const useUpdateCachedData = () => {
  return useCallback(
    (
      cachedData: CacheableObject | undefined,
      isOnChain: boolean,
      onCreate: () => void,
      onUpdateStatus: (status: DataStatus) => void,
      onRemove: () => void,
    ) => {
      if (!isOnChain) {
        if (cachedData?.status === DataStatus.CREATED_LOCALLY) {
          // The data was created locally, and it's not (yet) on chain.
          // To decide whether to delete it or keep it,
          // we need to check the last update date
          const elapsedTime = Date.now() - Date.parse(cachedData.lastEdited);
          if (elapsedTime > 30 * 1000) {
            // The data is not on-chain after 30 seconds, so we remove it from
            // the local storage as we assume something went wrong
            onRemove();
          }
        } else if (cachedData?.status === DataStatus.DELETED_LOCALLY) {
          // The data was deleted locally, and now it's not on chain as well.
          // This means we can safely remove it from the cache
          onRemove();
        } else if (cachedData?.status === DataStatus.SYNCED) {
          // The data was in-sync with the chain, it's not been edited locally,
          // but now it's no longer on-chain. This means it was deleted from another
          // device. So we remove it from the cache as well.
          onRemove();
        }
      } else {
        if (cachedData === undefined) {
          // The data is present on-chain, but it's not present locally.
          // This means it was added from another device. So we just add it
          onCreate();
        } else if (cachedData?.status === DataStatus.CREATED_LOCALLY) {
          // The data was created locally, and now it's on-chain as well.
          // For this reason, we just update its status to be in-sync with the chain.
          onUpdateStatus(DataStatus.SYNCED);
        } else if (cachedData?.status === DataStatus.DELETED_LOCALLY) {
          // The data was deleted locally, but it's still on-chain. To decide
          // what to do, we should check the last update time
          const elapsedTime = Date.now() - Date.parse(cachedData.lastEdited);
          if (elapsedTime > 30 * 1000) {
            // The data is on-chain after 30 seconds of the local deletion.
            // We are going to switch back its status to SYNCED in order to
            // revert the changes, as we assume something went wrong
            onUpdateStatus(DataStatus.SYNCED);
          }
        }
      }
    },
    [],
  );
};

export default useUpdateCachedData;
