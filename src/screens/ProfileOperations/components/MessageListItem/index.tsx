import Typography from 'components/Typography';
import useFormatTimeForPostDetails from 'hooks/formatting/useFormatTimeForPostDetails';
import React, { memo, ReactNode } from 'react';
import { View } from 'react-native';
import FastImage, { Source } from 'react-native-fast-image';
import { useTheme } from 'react-native-paper';
import { formatCoins } from 'lib/FormatUtils';
import { Coin } from '@cosmjs/stargate';
import useStyles from './useStyles';

export interface MessageListItemProps {
  /**
   * Image to be displayed associated with this message.
   */
  readonly image: Source;
  /**
   * Title to be displayed.
   */
  readonly title: string | ReactNode;
  /**
   * Fees paid to broadcast the transaction that includes this message.
   */
  readonly fees: Coin[];
  /**
   * Timestamp associated with the transaction.
   */
  readonly timestamp: string;
}

/**
 * Component that allows displaying a single transaction message within a list.
 * TODO: Instead of displaying each message individually, display a transaction and include all the messages within it.
 * TODO [Cont]: This way we can properly support multi-transaction messages.
 * @constructor
 */
const MessageListItem = (props: MessageListItemProps) => {
  const theme = useTheme();
  const styles = useStyles();

  const { image, title, fees, timestamp } = props;

  const formatDate = useFormatTimeForPostDetails();
  const formattedDate = formatDate(timestamp);

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
          -{formatCoins(fees, ', ')}
        </Typography.Subtitle3>
      </View>
    </View>
  );
};

export default memo(MessageListItem);
