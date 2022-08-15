import React from 'react';
import DView from 'components/DView';
import Typography from 'components/Typography';

export type EnterCommentParams = {
  /**
   * The author of the original post.
   */
  author: PostAuthor;

  /**
   * The id of the post that the reply belongs to.
   */
  postId: string;
};

const EnterComment = () => {
  return (
    <DView scrollable>
      <Typography.H3>Hello world</Typography.H3>
    </DView>
  );
};

export default EnterComment;
