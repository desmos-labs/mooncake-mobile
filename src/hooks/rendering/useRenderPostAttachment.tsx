import { Post } from 'types/posts';
import { AttachmentRenderOptions } from 'hooks/rendering/types';
import useRenderMediaAttachment from 'hooks/rendering/useRenderMediaAttachment';
import useRenderLinkPreview from 'hooks/rendering/useRenderLinkPreview';

/**
 * A hook to serve as a singular point to handle rendering of post attachments.
 * @param post The post to render the attachment for
 * @param options The options to use when rendering the attachment
 */
const useRenderPostAttachment = (post: Post, options?: AttachmentRenderOptions) => {
  const { MediaAttachment } = useRenderMediaAttachment(post, options?.media);
  const { LinkPreview } = useRenderLinkPreview(post);

  return {
    Attachment: MediaAttachment ?? LinkPreview,
  };
};

export default useRenderPostAttachment;
