import React, { useState } from 'react';
import { Post } from 'types/posts';
import { useQuery } from '@apollo/client';
import GetPostInteractionsAuthors from 'services/graphql/queries/GetPostInteractionsAuthors';
import { DesmosProfile } from 'types/desmos';
import { convertGraphQLProfile } from 'lib/GraphQLUtils';

/**
 * Hook that allows to get the list of users that have interacted with a post.
 * @param post {Post} - Post for which to get the list of interactions authors.
 * @param numberOfAuthors {number} - Max number of authors returned.
 */
const usePostInteractionsAuthors = (post: Post, numberOfAuthors: number) => {
  const [authors, setAuthors] = useState<DesmosProfile[]>([]);

  const { data, loading, refetch } = useQuery(GetPostInteractionsAuthors, {
    variables: {
      subspaceId: post.subspaceId,
      postId: post.id,
      limit: numberOfAuthors,
    },
  });

  React.useEffect(() => {
    if (!data) {
      return;
    }

    const { reactions, tips } = data;
    const reactionsAuthors = (reactions as any[]).map(r => r.author).map(convertGraphQLProfile);
    const tipsAuthors = (tips as any[]).map(t => t.author).map(convertGraphQLProfile);
    const fetchedAuthors = [...reactionsAuthors, ...tipsAuthors];

    // Returns the first X unique authors
    const uniqueAuthors = fetchedAuthors
      .filter((value, index) => fetchedAuthors.indexOf(value) === index)
      .slice(0, 4);
    setAuthors(uniqueAuthors);
  }, [data, setAuthors]);

  return {
    authors,
    loading,
    refetch,
  };
};

export default usePostInteractionsAuthors;
