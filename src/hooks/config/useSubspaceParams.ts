import React from 'react';
import { useQuery } from '@apollo/client';
import GetSubspaceConfig from 'services/graphql/queries/GetSubspaceConfig';
import { useAppStateValue, useSetAppStateValue } from '@recoil/appState';
import { convertGraphQLSubspaceParams } from 'lib/GraphQLUtils';

/**
 * Hook that allows to get the current subspace config, and refresh it if necessary.
 */
const useSubspaceParams = () => {
  const subspaceId = useAppStateValue('subspaceId');
  const subspaceParams = useAppStateValue('subspaceParams');
  const setSubspaceParams = useSetAppStateValue('subspaceParams');

  const { data, refetch } = useQuery(GetSubspaceConfig, {
    variables: { subspaceId },
    fetchPolicy: 'no-cache',
  });

  // Use the effect to react to the data update in order to update the cached value
  React.useEffect(() => {
    if (!data) {
      return;
    }
    setSubspaceParams(convertGraphQLSubspaceParams(data));
  }, [data, setSubspaceParams]);

  return {
    params: subspaceParams,
    refetch,
  };
};

export default useSubspaceParams;
