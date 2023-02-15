import React from 'react';
import { useQuery } from '@apollo/client';
import GetButterConfig from 'services/graphql/queries/GetButterConfig';
import { convertGraphQLButterConfig } from 'lib/GraphQLUtils';
import { useAppStateValue, useSetAppStateValue } from '@recoil/appState';

/**
 * Hook that allows to get the Butter config and also refresh its value if needed.
 */
const useButterConfig = () => {
  const { data, refetch, loading } = useQuery(GetButterConfig);

  const config = useAppStateValue('butterConfig');
  const setButterConfig = useSetAppStateValue('butterConfig');

  // Use the effect in order to update the cached version when the server data changes
  React.useEffect(() => {
    if (!data) {
      return;
    }
    setButterConfig(convertGraphQLButterConfig(data.config));
  }, [data, setButterConfig]);

  return {
    config,
    loading,
    refetch,
  };
};

export default useButterConfig;
