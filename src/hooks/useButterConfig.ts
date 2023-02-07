import React from 'react';
import { useQuery } from '@apollo/client';
import GetButterConfig from 'services/graphql/queries/GetButterConfig';
import { useSetButterConfig, useStoredButterConfig } from '@recoil/butterConfig';
import { convertGraphQLButterConfig } from 'lib/GraphQLUtils';

/**
 * Hook that allows to get the Butter config and also refresh its value if needed.
 */
const useButterConfig = () => {
  const { data, refetch } = useQuery(GetButterConfig);

  const config = useStoredButterConfig();
  const setButterConfig = useSetButterConfig();

  // Use the effect in order to update the cached version when the server data changes
  React.useEffect(() => {
    if (!data) {
      return;
    }
    setButterConfig(convertGraphQLButterConfig(data.config));
  }, [data, setButterConfig]);

  return {
    config,
    refetch,
  };
};

export default useButterConfig;
