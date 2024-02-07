import React from 'react';
import { getPostURLPreview } from 'lib/PostsUtils';
import { Post } from 'types/posts';
import LinkPreview from 'components/LinkPreview';

/**
 * Hook that allows to render the link preview of a post.
 * @param post The post to render the link preview for.
 */
const useRenderLinkPreview = (post: Post) => {
  const LinkPreviewComponent = React.useMemo(() => {
    const postUrlToPreview = getPostURLPreview(post);
    if (!postUrlToPreview) {
      return undefined;
    }

    return <LinkPreview url={postUrlToPreview} />;
  }, [post]);

  return {
    LinkPreview: LinkPreviewComponent,
  };
};

export default useRenderLinkPreview;
