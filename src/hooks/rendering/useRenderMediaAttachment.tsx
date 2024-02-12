import { Image } from 'expo-image';
import React from 'react';
import { Post, PostAttachmentType } from 'types/posts';
import { RenderProps } from 'hooks/rendering/types';

/**
 * A hook to serve as a singular point to handle rendering of post media attachments
 */
const useRenderMediaAttachment = (post: Post, renderProps: RenderProps) => {
  const MediaAttachment = React.useMemo(() => {
    const { attachments } = post;
    if (!attachments || attachments.length === 0) {
      return undefined;
    }

    // Currently only render one attachment
    // TODO: Add the ability to render multiple attachments
    const [attachment] = attachments;

    // Currently only render media attachments
    // TODO: Support the rendering of poll attachments too
    if (attachment.content.type === PostAttachmentType.MEDIA) {
      return (
        <Image
          transition={250}
          recyclingKey={attachment.content.uri}
          contentFit={renderProps?.contentFit ?? 'cover'}
          source={{ uri: attachment.content.uri }}
          // @ts-ignore
          style={renderProps?.style}
        />
      );
    }
  }, [post, renderProps?.contentFit, renderProps?.style]);

  return {
    MediaAttachment,
  };
};

export default useRenderMediaAttachment;
