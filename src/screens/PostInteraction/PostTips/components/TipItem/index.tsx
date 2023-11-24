import Typography from 'components/Typography';
import { Image } from 'expo-image';
import { formatCoins } from 'lib/FormatUtils';
import { getProfilePicture } from 'lib/ProfileUtils';
import React from 'react';
import { View } from 'react-native';
import { PostTip } from 'types/desmos';
import useStyles from './useStyles';

type Props = {
  tip: PostTip;
};

/**
 * Component that represents a single post tip inside a list.
 * @constructor
 */
const TipItem = (props: Props) => {
  const styles = useStyles();
  const { tip } = props;

  return (
    <View style={styles.container} onStartShouldSetResponder={() => true}>
      <Image source={getProfilePicture(tip.sender)} style={styles.avatarStyle} />

      <View style={styles.textGroup}>
        <Typography.Subtitle3 style={styles.textStyle} numberOfLines={1}>
          {tip.sender.nickname || tip.sender.address}
        </Typography.Subtitle3>
        <Typography.Body7 style={styles.subTextStyle}>@{tip.sender.dTag}</Typography.Body7>
      </View>

      <Typography.Subtitle3 style={styles.textStyle}>
        {formatCoins(tip.amount, ', ')}
      </Typography.Subtitle3>
    </View>
  );
};

export default TipItem;
