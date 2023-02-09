import Typography from 'components/Typography';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, View } from 'react-native';
import FastImage, { Source } from 'react-native-fast-image';
import { ActivityIndicator, useTheme } from 'react-native-paper';
import useStyles from './useStyles';

type Props = {
  loading: boolean;
  accountsHighlightedPics: Source[];
  tipsCounter: number;
  likesCounter: number;
  handlePressCounters: () => void;
};

const InteractionCountersBar = ({
  loading,
  accountsHighlightedPics,
  tipsCounter,
  likesCounter,
  handlePressCounters,
}: Props) => {
  const styles = useStyles();
  const theme = useTheme();
  const { t } = useTranslation('postDetails');
  // TODO i dont like this but i had not found any better idea
  const calculatedWidth =
    accountsHighlightedPics.length === 1 ? 30 : accountsHighlightedPics.length === 2 ? 50 : 70;

  return loading ? (
    <ActivityIndicator color={theme.colors.surfaceBlack} />
  ) : (
    <View style={styles.container}>
      <TouchableOpacity onPress={handlePressCounters} style={styles.button}>
        {accountsHighlightedPics[0] && (
          <View style={{ width: calculatedWidth, height: 30 }}>
            {accountsHighlightedPics[0] && (
              <FastImage source={accountsHighlightedPics[0]} style={styles.icon1} />
            )}
            {accountsHighlightedPics[1] && (
              <FastImage source={accountsHighlightedPics[1]} style={styles.icon2} />
            )}
            {accountsHighlightedPics[2] && (
              <FastImage source={accountsHighlightedPics[2]} style={styles.icon3} />
            )}
          </View>
        )}
        <Typography.Button2 style={styles.text}>
          {t('likes and tips', { likesCounter, tipsCounter })}
        </Typography.Button2>
      </TouchableOpacity>
    </View>
  );
};

export default InteractionCountersBar;
