import { commentLiked } from 'assets/images';
import Typography from 'components/Typography';
import { getProfilePicture } from 'lib/ProfileUtils';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, View } from 'react-native';
import { PostReaction } from 'types/desmos';
import useStyles from './useStyles';

type Props = {
  reaction: PostReaction;
};

/**
 * Component that is used in order to display the given {@param reaction} inside a list.
 * @constructor
 */
const ReactionItem = ({ reaction }: Props) => {
  const styles = useStyles();
  const { t } = useTranslation('postInteraction');

  return (
    <View style={styles.container} onStartShouldSetResponder={() => true}>
      <Image source={getProfilePicture(reaction.author)} style={styles.avatarStyle} />
      <View style={styles.textGroup}>
        <View>
          <Typography.Subtitle3 style={styles.textStyle}>
            {reaction.author.nickname ? reaction.author.nickname : t('common:no nickname')}
          </Typography.Subtitle3>
          <Typography.Body7 style={styles.subTextStyle}>@{reaction.author.dTag}</Typography.Body7>
        </View>
      </View>

      <Image source={commentLiked} style={styles.likedIcon} />
    </View>
  );
};

export default ReactionItem;
