import React from 'react';
import { useAppStateValue } from '@recoil/appState';
import { getLikeReactionId } from 'types/desmos';
import { Reactions } from '@desmoslabs/desmjs';

/**
 * Hook that returns the reaction value to be used inside GraphQL queries.
 */
const useGetQueryReactionValue = () => {
  const subspaceParams = useAppStateValue('subspaceParams');
  return React.useCallback(() => {
    return {
      '@type': Reactions.v1.RegisteredReactionValueTypeUrl,
      registered_reaction_id: getLikeReactionId(subspaceParams),
    };
  }, [subspaceParams]);
};

export default useGetQueryReactionValue;
