import { commentIcon, commentLiked, commentLikeEmptyIcon } from 'assets/images';
import Spacer from 'components/Spacer';
import Typography from 'components/Typography';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, TouchableOpacity, View } from 'react-native';
import { Divider } from 'native-base';
import useStyles from './useStyles';

type Props = {
  postLiked: boolean;
  handleLikePress: () => void;
  handleCommentPress: () => void;
};

/**
 * Action bar that allows the user to interact with the post by adding a reaction, commenting or tipping it.
 * @constructor
 */
const PostActionButtonsBar = (props: Props) => {
  const styles = useStyles();
  const { t } = useTranslation('postDetails');
  const { postLiked, handleLikePress, handleCommentPress } = props;

  return (
    <>
      <Spacer paddingTop={16} />
      <Divider style={styles.divider} />
      <View style={styles.container}>
        <TouchableOpacity onPress={handleLikePress} style={styles.button}>
          <Image
            source={postLiked ? commentLiked : commentLikeEmptyIcon}
            style={[styles.icon, postLiked && styles.orangeIconAndText]}
          />
          <Typography.Subtitle3
            numberOfLines={1}
            style={[styles.text, postLiked && styles.orangeText]}>
            {t('like')}
          </Typography.Subtitle3>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleCommentPress} style={styles.button}>
          <Image source={commentIcon} style={styles.icon} />
          <Typography.Subtitle3 numberOfLines={1} style={styles.text}>
            {t('comment')}
          </Typography.Subtitle3>
        </TouchableOpacity>
      </View>
      <Divider style={styles.divider} />
    </>
  );
};

export default PostActionButtonsBar;
