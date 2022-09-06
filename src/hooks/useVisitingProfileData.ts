import {useQuery} from '@apollo/client';
import {useMemo} from 'react';
import GetProfileForAddress from 'services/graphql/queries/GetProfileForAddress';

/**
 * WIP hook to retrieve the user's most recent active account
 *
 */
const useVisitingProfileData = (address: string) => {
  const {data, loading: visitingProfileLoading} = useQuery(
    GetProfileForAddress,
    {
      variables: {address},
    },
  );

  const visitingProfileData = useMemo(() => data?.profile[0] || {}, [data]);

  return {
    visitingProfileData,
    visitingProfileLoading,
  };
};

export default useVisitingProfileData;
