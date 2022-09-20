import React from 'react';
import {TouchableOpacity} from 'react-native';
import Typography from 'components/Typography';
import useRenderMediaAttachment from 'hooks/rendering/useRenderMediaAttachment';
import useStyles from './useStyles';

type Props = {
  postData: PostItem;

  onPress: () => void;
};

const ProfilePostCard = ({postData, onPress}: Props) => {
  const styles = useStyles();

  const {attachments} = postData;

  const {MediaAttachment} = useRenderMediaAttachment({attachments});

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      {MediaAttachment}
      <Typography.H2 style={styles.textStyle}>{postData.text}</Typography.H2>
    </TouchableOpacity>
  );
};

export default ProfilePostCard;
