import React from 'react';
import {TouchableOpacity} from 'react-native';
import Typography from 'components/Typography';
import useRenderMediaAttachment from 'hooks/rendering/useRenderMediaAttachment';
import useStyles from './useStyles';

type Props = {
  postData: PostItem;

  onPress: () => void;

  postsSize: number;
  postsMargin: string | number;
};

const ProfilePostCard = ({
  postData,
  onPress,
  postsSize,
  postsMargin,
}: Props) => {
  const styles = useStyles({size: postsSize, margin: postsMargin});

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
