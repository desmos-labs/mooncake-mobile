import {commentIcon, commentLiked, optionsIcon, tipIcon} from 'assets/images';
import Spacer from 'components/Spacer';
import Typography from 'components/Typography';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {Image, TouchableOpacity, View} from 'react-native';
import {Divider} from 'react-native-paper';
import useStyles from './useStyles';

type Props = {
  postLiked: boolean;
  handleLikePress: () => void;
  handleCommentPress: () => void;
  handleTipPress: () => void;
};

const PostActionButtonsBar = ({
  postLiked,
  handleLikePress,
  handleCommentPress,
  handleTipPress,
}: Props) => {
  const styles = useStyles();
  const {t} = useTranslation('postDetails');

  return (
    <>
      <Spacer paddingTop={16} />
      <Divider style={styles.divider} />
      <View style={styles.container}>
        <TouchableOpacity onPress={handleLikePress} style={styles.button}>
          <Image
            source={postLiked ? commentLiked : optionsIcon}
            style={styles.icon}
          />
          <Typography.Subtitle3 style={styles.text}>
            {t('like')}
          </Typography.Subtitle3>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleCommentPress} style={styles.button}>
          <Image source={commentIcon} style={styles.icon} />
          <Typography.Subtitle3 style={styles.text}>
            {t('comment')}
          </Typography.Subtitle3>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleTipPress} style={styles.button}>
          <Image source={tipIcon} style={styles.icon} />
          <Typography.Subtitle3 style={styles.text}>
            {t('tip')}
          </Typography.Subtitle3>
        </TouchableOpacity>
      </View>
      <Divider style={styles.divider} />
    </>
  );
};

export default PostActionButtonsBar;
