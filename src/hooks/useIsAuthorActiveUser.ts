import React from 'react';
import { useActiveAccountAddress } from '@recoil/accounts';
import { Post } from 'types/posts';

/**
 * A hook that checks if a given post was created by the current active user.
 */
const useIsAuthorActiveUser = (post: Post) => {
  const activeAccountAddress = useActiveAccountAddress();

  return React.useMemo(() => {
    return activeAccountAddress === post.author.address;
  }, [activeAccountAddress, post]);
};

export default useIsAuthorActiveUser;
