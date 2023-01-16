import {useResetRecoilState} from 'recoil';
import {optimisticRelationshipState} from '@recoil/optimisticUI/optimisticRelationships';
import {useCallback} from 'react';
import {deleteMMKV, MMKVKEYS} from 'lib/MMKVStorage';

/**
 * Reset the all recoil and stored MMKV values related to optimistic UI.
 */
const useResetOptimisticUI = () => {
  const resetOptimisticRelationshipState = useResetRecoilState(
    optimisticRelationshipState,
  );

  const resetOptimisticUI = useCallback(() => {
    resetOptimisticRelationshipState();
    deleteMMKV(MMKVKEYS.OPTIMISTIC_RELATIONSHIPS);
  }, []);

  return {
    resetOptimisticUI,
  };
};

export default useResetOptimisticUI;
