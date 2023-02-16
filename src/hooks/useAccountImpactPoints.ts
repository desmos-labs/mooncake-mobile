import { useQuery } from '@apollo/client';
import GetAccountImpactPoints from 'services/graphql/queries/GetAccountImpactPoints';

/**
 * Hook that allows to return the impact points of the account by querying the GraphQL server.
 */
const useAccountImpactPoints = () => {
  const { data, loading, refetch } = useQuery(GetAccountImpactPoints, {
    fetchPolicy: 'cache-and-network',
  });

  return {
    impactPoints: data?.points?.aggregate?.sum?.value ?? 0,
    loading,
    refetch,
  };
};
export default useAccountImpactPoints;
