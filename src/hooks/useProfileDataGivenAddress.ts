import {useQuery} from '@apollo/client';
import {useMemo} from 'react';
import GetProfileForAddress from 'services/graphql/queries/GetProfileForAddress';

/**
 * WIP hook to retrieve the selected address profile datas
 *
 */
const useProfileDataGivenAddress = (address: string) => {
  const {
    data,
    loading: visitingProfileLoading,
    refetch,
  } = useQuery(GetProfileForAddress, {
    variables: {address},
    fetchPolicy: 'no-cache',
  });

  const visitingProfileData = useMemo(() => data?.profile[0] || {}, [data]);

  return {
    visitingProfileData,
    visitingProfileLoading,
    refetchVisitingProfileData: refetch,
  };
};

export default useProfileDataGivenAddress;
