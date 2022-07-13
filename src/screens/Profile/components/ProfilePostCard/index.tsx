import React from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import Typography from 'components/Typography';
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
      if (attachment.content['@type'] === '/desmos.posts.v1.Media') {
        return (
          <Image
            source={{
              uri: attachment.content.uri,
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
      <View style={styles.textContainer}>
        <Typography.H2 style={styles.textStyle}>{postData.text}</Typography.H2>
      </View>
    </TouchableOpacity>
  );
};

export default ProfilePostCard;
