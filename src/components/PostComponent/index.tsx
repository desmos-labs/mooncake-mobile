import Typography from 'components/Typography';
import React, {useEffect} from 'react';
import {Image, View} from 'react-native';
import useStyles from './useStyles';

type Props = {
  /**
   * The data of the post retrieved from a query.
   */
  postData: PostItem;
};

enum POST_TYPE {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  IMAGE_TEXT = 'IMAGE_TEXT',
}

const PostComponent = ({postData}: Props) => {
  const styles = useStyles();

  const {attachments} = postData;

  useEffect(() => {
    console.log(postData);
    console.log(postData.attachments);
    console.log(postData.text);
  }, [postData]);

  const AttachmentImage = React.useMemo(() => {
    const [attachment] = attachments;

    if (attachment) {
      if (attachment.content['@type'] === '/desmos.posts.v1.Media') {
        return (
          <Image
            source={{
              uri: attachment.content.uri,
            }}
            style={{width: '100%', height: '100%'}}
          />
        );
      }
    }
    return undefined;
  }, []);

  const postType: POST_TYPE = React.useMemo(() => {
    if (postData.text && postData.attachments.length === 0) {
      return POST_TYPE.TEXT;
    }
    if (postData.text && postData.attachments.length > 0) {
      return POST_TYPE.IMAGE_TEXT;
    }
    if (!postData.text && postData.attachments.length > 0) {
      return POST_TYPE.IMAGE;
    }

    // This should never be reached. Logged post id's should be checked for
    // validity
    console.log('Default post behavior for post id', postData.id);
    return POST_TYPE.TEXT;
  }, []);

  const content = React.useMemo(() => {
    if (postType === POST_TYPE.TEXT || postType === POST_TYPE.IMAGE) {
      return (
        <View style={styles.textContainer}>
          <Typography.H2 style={styles.textStyle}>
            {postData.text}
          </Typography.H2>
        </View>
      );
    }
    if (postType === POST_TYPE.IMAGE_TEXT) {
      return (
        <View>
          <Typography.Body6 style={styles.imagePostText}>
            {postData.text}
          </Typography.Body6>
        </View>
      );
    }
  }, [postType]);

  return (
    <View style={styles.container}>
      {AttachmentImage}
      {content}
    </View>
  );
};

export default PostComponent;
