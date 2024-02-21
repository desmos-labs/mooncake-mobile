import Typography from '@desmoslabs/desmos-kit-ui/components/Typography';
import { postLikedIcon, postShareIcon, postToCommentIcon, postToLikeIcon } from 'assets/images';
import Divider from 'components/Divider';
import Spacer from 'components/Spacer';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, TouchableOpacity, View } from 'react-native';
import useStyles from './useStyles';

type Props = {
  postLiked: boolean;
  handleLikePress: () => void;
  handleCommentPress: () => void;
  handlePressShare: () => void;
};

/**
 * Action bar that allows the user to interact with the post by adding a reaction, commenting or tipping it.
 * @constructor
 */
const PostActionButtonsBar = (props: Props) => {
  const styles = useStyles();
  const { t } = useTranslation('postDetails');
  const { postLiked, handleLikePress, handleCommentPress, handlePressShare } = props;

  return (
    <>
      <Spacer paddingTop={16} />
      <Divider style={styles.divider} />
      <View style={styles.container}>
        <TouchableOpacity onPress={handleLikePress} style={styles.button}>
          <Image
            source={postLiked ? postLikedIcon : postToLikeIcon}
            style={[styles.icon, postLiked && styles.orangeIconAndText]}
          />
          <Typography.Regular14
            numberOfLines={1}
            style={[styles.text, postLiked && styles.orangeText]}>
            {t('like')}
          </Typography.Regular14>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleCommentPress} style={styles.button}>
          <Image source={postToCommentIcon} style={styles.icon} />
          <Typography.Regular14 numberOfLines={1} style={styles.text}>
            {t('comment')}
          </Typography.Regular14>
        </TouchableOpacity>
        <TouchableOpacity onPress={handlePressShare} style={styles.button}>
          <Image source={postShareIcon} style={styles.icon} />
          <Typography.Regular14 numberOfLines={1} style={styles.text}>
            {t('share')}
          </Typography.Regular14>
        </TouchableOpacity>
      </View>
      <Divider style={styles.divider} />
    </>
  );
};

export default PostActionButtonsBar;
