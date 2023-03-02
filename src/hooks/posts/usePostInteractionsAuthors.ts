import React, { useState } from 'react';
import { Post } from 'types/posts';
import { useQuery } from '@apollo/client';
import GetPostInteractionsAuthors from 'services/graphql/queries/GetPostInteractionsAuthors';
import { DesmosProfile } from 'types/desmos';
import { convertGraphQLProfile } from 'lib/GraphQLUtils';
import useHasReacted from 'hooks/reactions/useHasReacted';
import useHasTipped from 'hooks/tips/useHasTipped';
import { useActiveAccountAddress } from '@recoil/accounts';

/**
 * Hook that allows to get the list of users that have interacted with a post.
 * @param post {Post} - Post for which to get the list of interactions authors.
 * @param numberOfAuthors {number} - Max number of authors returned.
 */
const usePostInteractionsAuthors = (
  post: Pick<Post, 'subspaceId' | 'id'>,
  numberOfAuthors: number,
) => {
  const activeAddress = useActiveAccountAddress();
  if (!activeAddress) {
    throw new Error('Trying to get post interactions authors without active address');
  }

  const [authors, setAuthors] = useState<DesmosProfile[]>([]);

  const hasReacted = useHasReacted(post);
  const hasTipped = useHasTipped(post);

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

    const reactionsAuthors = (reactions as any[])
      .map(r => r.author)
      .map(convertGraphQLProfile)
      .filter(
        author => author !== undefined && (hasReacted || author?.address !== activeAddress),
      ) as DesmosProfile[];

    const tipsAuthors = (tips as any[])
      .map(t => t.author)
      .map(convertGraphQLProfile)
      .filter(
        author => author !== undefined && (hasTipped || author.address !== activeAddress),
      ) as DesmosProfile[];

    const fetchedAuthors = [...reactionsAuthors, ...tipsAuthors];

    // Returns the first X unique authors
    const uniqueAuthors = fetchedAuthors
      .filter(
        (value, index) =>
          fetchedAuthors.findIndex(profile => profile.address === value.address) === index,
      )
      .slice(0, 4);
    setAuthors(uniqueAuthors);
  }, [activeAddress, data, hasReacted, hasTipped, setAuthors]);

  return {
    authors,
    loading,
    refetch,
  };
};

export default usePostInteractionsAuthors;
