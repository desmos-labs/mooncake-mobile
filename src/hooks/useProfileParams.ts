import React from 'react';
import {useQuery} from '@apollo/client';
import GetProfileParams from 'services/graphql/queries/GetProfileParams';
import {convertGraphQLProfileParams} from 'lib/GraphQLUtils';
import {useDesmosParam, useSetDesmosParam} from '@recoil/desmosParams';

/**
 * Hook that allows to get the Desmos profiles params.
 */
const useProfileParams = () => {
  const profilesParams = useDesmosParam('profiles');
  const setProfileParams = useSetDesmosParam('profiles');

  const {data, refetch} = useQuery(GetProfileParams);

  // We use an effect in order to make sure that when the data is fetched from the server,
  // we update the local storage with the new value
  React.useEffect(() => {
    if (!data) {
      return;
    }
    setProfileParams(convertGraphQLProfileParams(data.params.params));
  }, [data, setProfileParams]);

  return {
    params: profilesParams,
    refetch,
  };
};

export default useProfileParams;
