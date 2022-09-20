import React from 'react';
import {Image, StyleSheet, TouchableOpacity} from 'react-native';
import Typography from 'components/Typography';
import _ from 'lodash';
import useStyles from './useStyles';

type Props = {
  postData: PostItem;

  onPress: () => void;
};

const ProfilePostCard = ({postData, onPress}: Props) => {
  const styles = useStyles();

  const {attachments} = postData;

  const AttachmentImage = React.useMemo(() => {
    const [attachment] = attachments;

    if (attachment) {
      if (attachment.content['@type'].includes('Media')) {
        return (
          <Image
            source={{
              uri: _.get(attachment, 'content.uri'),
            }}
            style={StyleSheet.absoluteFillObject}
          />
        );
      }
    }
    return undefined;
  }, []);

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      {AttachmentImage}
      <Typography.H2 style={styles.textStyle}>{postData.text}</Typography.H2>
    </TouchableOpacity>
  );
};

export default ProfilePostCard;
