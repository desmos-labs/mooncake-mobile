import React from 'react';
import {View, Image, ImageSourcePropType} from 'react-native';
import Typography from 'components/Typography';
import {format} from 'date-fns';
import useStyles from './useStyles';

type Props = {
  tipAmount: number;

  avatar: ImageSourcePropType;

  nickname: string;

  dTag: string;

  timestamp: string;
};

const formatTime = (timestamp: string) => {
  return format(new Date(timestamp), 'd LLL, HH:mm');
};

const TipItem = ({tipAmount, avatar, nickname, dTag, timestamp}: Props) => {
  const styles = useStyles();

  return (
    <View style={styles.container} onStartShouldSetResponder={() => true}>
      <Image source={avatar} style={styles.avatarStyle} />

      <View style={styles.textGroup}>
        <Typography.Subtitle3 style={styles.textStyle}>
          {nickname}
        </Typography.Subtitle3>
        <Typography.Body7 style={styles.subTextStyle}>
          @{dTag}・{formatTime(timestamp)}
        </Typography.Body7>
      </View>

      <Typography.Subtitle3 style={styles.textStyle}>
        {tipAmount} DSM
      </Typography.Subtitle3>
    </View>
  );
};

export default TipItem;
