import { useLazyQuery } from '@apollo/client';
import { FetchDataFunction } from 'hooks/usePaginatedData';
import { convertGraphQLProfile } from 'lib/GraphQLUtils';
import React from 'react';
import SearchProfiles from 'services/graphql/queries/SearchProfiles';
import { DesmosProfile } from 'types/desmos';

interface Filter {
  value: string;
}

/**
 * Hook that provides a function that can be used from usePaginatedData
 * to fetch the validators.
 */
const useSearchUsers = () => {
  const [searchUsers] = useLazyQuery(SearchProfiles);

  return React.useCallback<FetchDataFunction<DesmosProfile, Filter>>(
    async (offset, limit, filter) => {
      if (filter?.value === '') {
        return {
          data: [],
          endReached: true,
        };
      }
      const { data, error } = await searchUsers({
        variables: {
          search: `%${filter?.value}%`,
          offset,
          limit,
        },
      });

      if (error) {
        throw error;
      }

      const profiles =
        data?.profiles?.map((profile: any) => convertGraphQLProfile(profile)) ??
        ([] as DesmosProfile[]);

      return {
        data: profiles,
        endReached: profiles.length < limit,
      };
    },
    [searchUsers],
  );
};

export default useSearchUsers;
