import Typography from 'components/Typography';
import React, {useEffect} from 'react';
import {Dimensions, ImageBackground, View} from 'react-native';
import useStyles from './useStyles';

// TODO: refactor this component to handle images and text + image shareable between home and post details

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
  const {width} = Dimensions.get('window');

  useEffect(() => {
    console.log(width);
  }, []);

  const AttachmentImage = React.useMemo(() => {
    const [attachment] = attachments;

    if (attachment) {
      if (attachment.content['@type'] === '/desmos.posts.v1.Media') {
        return (
          <ImageBackground
            resizeMode="cover"
            source={{
              uri: attachment.content.uri,
            }}
            style={{width, height: 630}}
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
  }, [postData]);

  const content = React.useMemo(() => {
    if (postType === POST_TYPE.TEXT) {
      return (
        <View style={styles.textContainer}>
          <Typography.H2 style={styles.textStyle}>
            {postData.text}
          </Typography.H2>
        </View>
      );
    } else if (postType === POST_TYPE.IMAGE) {
      return <View>{AttachmentImage}</View>;
    } else {
      return (
        <View>
          {AttachmentImage}
          <Typography.Body7>{postData.text}</Typography.Body7>
        </View>
      );
    }
  }, [postType, postData]);

  return <View style={styles.container}>{content}</View>;
};

export default PostComponent;
