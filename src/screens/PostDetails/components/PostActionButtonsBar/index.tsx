import {
  commentIcon,
  commentIconCommented,
  commentLiked,
  commentLikeEmptyIcon,
  tipIcon,
  tipIconTipped,
} from 'assets/images';
import Spacer from 'components/Spacer';
import Typography from 'components/Typography';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {Image, TouchableOpacity, View} from 'react-native';
import {Divider} from 'react-native-paper';
import useStyles from './useStyles';

type Props = {
  postCommented: boolean;
  postLiked: boolean;
  postTipped: boolean;
  handleLikePress: () => void;
  handleCommentPress: () => void;
  handleTipPress: () => void;
};

const PostActionButtonsBar = ({
  postCommented,
  postLiked,
  postTipped,
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
            source={postLiked ? commentLiked : commentLikeEmptyIcon}
            style={[styles.icon, postLiked && styles.orangeIconAndText]}
          />
          <Typography.Subtitle3
            style={[styles.text, postLiked && styles.orangeIconAndText]}>
            {t('like')}
          </Typography.Subtitle3>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleCommentPress} style={styles.button}>
          <Image
            source={postCommented ? commentIconCommented : commentIcon}
            style={[styles.icon, postCommented && styles.orangeIconAndText]}
          />
          <Typography.Subtitle3
            style={[styles.text, postCommented && styles.orangeIconAndText]}>
            {t('comment')}
          </Typography.Subtitle3>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleTipPress} style={styles.button}>
          <Image
            source={postTipped ? tipIconTipped : tipIcon}
            style={[styles.icon, postTipped && styles.orangeIconAndText]}
          />
          <Typography.Subtitle3
            style={[styles.text, postTipped && styles.orangeIconAndText]}>
            {t('tip')}
          </Typography.Subtitle3>
        </TouchableOpacity>
      </View>
      <Divider style={styles.divider} />
    </>
  );
};

export default PostActionButtonsBar;
