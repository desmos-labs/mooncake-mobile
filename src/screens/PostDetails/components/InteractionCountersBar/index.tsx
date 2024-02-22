import Typography from '@desmoslabs/desmos-kit-ui/components/Typography';
import { Skeleton } from 'moti/skeleton';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, View } from 'react-native';
import useStyles from './useStyles';

type Props = {
  loading: boolean;
  likesCounter: number;
  commentsCounter: number;
  handlePressCounters: () => void;
};

/**
 * Component that allows to show the number and authors of a post interactions (i.e. reactions, tips).
 * @constructor
 */
const InteractionCountersBar = (props: Props) => {
  const styles = useStyles();
  const { t } = useTranslation('postDetails');

  const { loading, likesCounter, commentsCounter, handlePressCounters } = props;

  return loading ? (
    <View style={styles.container}>
      <Skeleton height="4" radius={8} />
    </View>
  ) : (
    <View style={styles.container}>
      <View style={styles.button}>
        <Typography.Semibold14 style={styles.textBold}>{commentsCounter}</Typography.Semibold14>
        <Typography.Regular14 style={styles.text}>{t('comments')}</Typography.Regular14>
      </View>
      <TouchableOpacity onPress={handlePressCounters} style={styles.button}>
        <Typography.Semibold14 style={styles.text}>{likesCounter}</Typography.Semibold14>
        <Typography.Regular14 style={styles.text}>{t('likes')}</Typography.Regular14>
      </TouchableOpacity>
    </View>
  );
};

export default InteractionCountersBar;
