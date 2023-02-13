import Typography from 'components/Typography';
import React from 'react';
import { View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { PostTip } from 'types/desmos';
import { getProfilePicture } from 'lib/ProfileUtils';
import { formatCoins } from 'lib/FormatUtils';
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
      <FastImage source={getProfilePicture(tip.sender)} style={styles.avatarStyle} />

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
