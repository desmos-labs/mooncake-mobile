import { commentLiked, defaultProfilePic } from 'assets/images';
import Typography from 'components/Typography';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import useStyles from './useStyles';

type Props = {
  reaction: {
    value: any;
    author: any;
  };
};

const ReactionItem = ({ reaction }: Props) => {
  const styles = useStyles();
  const { t } = useTranslation('postInteraction');

  return (
    <View style={styles.container} onStartShouldSetResponder={() => true}>
      <FastImage
        source={
          reaction.author.profile_pic ? { uri: reaction.author.profile_pic } : defaultProfilePic
        }
        style={styles.avatarStyle}
      />
      <View style={styles.textGroup}>
        <View>
          <Typography.Subtitle3 style={styles.textStyle}>
            {reaction.author.nickname ? reaction.author.nickname : t('common:no nickname')}
          </Typography.Subtitle3>
          <Typography.Body7 style={styles.subTextStyle}>@{reaction.author.dtag}</Typography.Body7>
        </View>
      </View>

      <Image source={commentLiked} style={styles.likedIcon} />
    </View>
  );
};

export default ReactionItem;
