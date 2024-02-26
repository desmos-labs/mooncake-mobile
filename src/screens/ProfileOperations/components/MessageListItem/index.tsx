import { Coin } from '@cosmjs/stargate';
import Typography from '@desmoslabs/desmos-kit-ui/components/Typography';
import { Image, ImageSource } from 'expo-image';
import useFormatTimeForPostDetails from 'hooks/formatting/useFormatTimeForPostDetails';
import { formatCoins } from 'lib/FormatUtils';
import React, { memo, ReactNode } from 'react';
import { View } from 'react-native';
import useStyles from './useStyles';

interface MessageListItemProps {
  /**
   * Image to be displayed associated with this message.
   */
  readonly image: ImageSource;
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
  /**
   * Flag that indicates if the fees should be hidden.
   */
  readonly hideFees: boolean;
}

/**
 * Component that allows displaying a single transaction message within a list.
 * TODO: Instead of displaying each message individually, display a transaction and include all the messages within it.
 * TODO [Cont]: This way we can properly support multi-transaction messages.
 * @constructor
 */
const MessageListItem = (props: MessageListItemProps) => {
  const styles = useStyles();

  const { image, title, fees, timestamp, hideFees } = props;

  const formatDate = useFormatTimeForPostDetails();
  const formattedDate = formatDate(timestamp);

  return (
    <View style={styles.container}>
      <View style={styles.leftSide}>
        <Image style={styles.avatar} source={image} />
        <View style={styles.profileView}>
          <Typography.Regular12>{title}</Typography.Regular12>
          <Typography.Regular10 style={styles.formattedDate}>{formattedDate}</Typography.Regular10>
        </View>
      </View>
      {!hideFees ? (
        <Typography.Semibold12 numberOfLines={1}>-{formatCoins(fees, ', ')}</Typography.Semibold12>
      ) : (
        <Typography.Semibold14 numberOfLines={1}>. . . .</Typography.Semibold14>
      )}
    </View>
  );
};

export default memo(MessageListItem);
