import { useAppStateValue } from '@recoil/appState';
import { getLikeReactionId } from 'types/desmos';
import { RegisteredReactionValueTypeUrl } from '@desmoslabs/desmjs';

/**
 * Hook that returns the reaction value to be used inside GraphQL queries.
 */
const useQueryReactionValue = () => {
  const subspaceParams = useAppStateValue('subspaceParams');
  return {
    '@type': RegisteredReactionValueTypeUrl,
    registered_reaction_id: getLikeReactionId(subspaceParams),
  };
};

export default useQueryReactionValue;
