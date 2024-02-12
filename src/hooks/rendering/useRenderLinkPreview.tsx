import React from 'react';
import { getPostURLPreview } from 'lib/PostsUtils';
import { Post } from 'types/posts';
import LinkPreview from 'components/LinkPreview';
import { RenderProps } from 'hooks/rendering/types';

/**
 * Hook that allows to render the link preview of a post.
 * @param post The post to render the link preview for.
 * @param renderProps The rendering options for the link preview.
 */
const useRenderLinkPreview = (post: Post, renderProps?: RenderProps) => {
  const LinkPreviewComponent = React.useMemo(() => {
    const postUrlToPreview = getPostURLPreview(post);
    if (!postUrlToPreview) {
      return undefined;
    }

    return <LinkPreview url={postUrlToPreview} previewStyle={renderProps?.style} />;
  }, [post, renderProps?.style]);

  return {
    LinkPreview: LinkPreviewComponent,
  };
};

export default useRenderLinkPreview;
