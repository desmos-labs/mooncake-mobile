import { ChainInfo } from '@desmoslabs/desmjs/build/types/chains';
import Typography from 'components/Typography';
import useFormatTimeForPostDetails from 'hooks/useFormatTimeForPostDetails';
import React, { memo } from 'react';
import { View } from 'react-native';
import FastImage, { Source } from 'react-native-fast-image';
import { useTheme } from 'react-native-paper';
import useStyles from './useStyles';

const TxComponent = ({
  image,
  title,
  timestamp,
  fees,
  chain,
}: {
  image: Source;
  title: string;
  timestamp: string;
  fees: number | string;
  chain: ChainInfo;
}) => {
  const theme = useTheme();
  const styles = useStyles();
  const formattedDate = useFormatTimeForPostDetails(timestamp);

  return (
    <View style={styles.container}>
      <View style={styles.flexRowView}>
        <FastImage style={styles.avatar} source={image} />
        <View style={styles.profileView}>
          <Typography.Subtitle3>{title}</Typography.Subtitle3>
          <Typography.Body7 style={{ color: theme.colors.grey02, marginTop: 2 }}>
            {formattedDate}
          </Typography.Body7>
        </View>
        <Typography.Subtitle3 numberOfLines={1} style={styles.feesText}>
          -{fees} {chain.stakeCurrency.coinDenom.toUpperCase()}
        </Typography.Subtitle3>
      </View>
    </View>
  );
};

export default memo(TxComponent);
