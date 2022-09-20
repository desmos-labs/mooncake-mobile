import Typography from 'components/Typography';
import _ from 'lodash';
import React from 'react';
import {Dimensions, ImageBackground, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import useStyles from './useStyles';

// TODO: refactor this component to handle images and text + image shareable between home and post details

type Props = {
  /**
   * The data of the post retrieved from a query.
   */
  postData: PostItem;
};

const PostComponent = ({postData}: Props) => {
  const styles = useStyles();
  const theme = useTheme();
  const {attachments} = postData;
  const {width} = Dimensions.get('window');

  const AttachmentImage = React.useMemo(() => {
    const [attachment] = attachments;

    if (attachment) {
      if (attachment.content['@type'].includes('Media')) {
        return (
          <ImageBackground
            resizeMode="cover"
            source={{
              uri: _.get(attachment, 'content.uri'),
            }}
            style={{width, height: 630}}
          />
        );
      }
    }
    return undefined;
  }, []);

  const content = React.useMemo(() => {
    if (postData?.text && postData?.attachments?.length === 0) {
      return (
        <View style={styles.textContainer}>
          <Typography.H2 style={styles.textStyle}>
            {postData.text}
          </Typography.H2>
        </View>
      );
    } else if (!postData?.text && postData?.attachments?.length > 0) {
      return <View>{AttachmentImage}</View>;
    } else {
      return (
        <View>
          {AttachmentImage}
          <Typography.Body7 style={{margin: theme.spacing.m}}>
            {postData.text}
          </Typography.Body7>
        </View>
      );
    }
  }, [postData]);

  return (
    <View onStartShouldSetResponder={() => true} style={styles.container}>
      {content}
    </View>
  );
};

export default PostComponent;
