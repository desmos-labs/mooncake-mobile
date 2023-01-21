import Typography from 'components/Typography';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {TouchableOpacity, View} from 'react-native';
import FastImage, {Source} from 'react-native-fast-image';
import {ActivityIndicator, useTheme} from 'react-native-paper';
import useStyles from './useStyles';

type Props = {
  loading: boolean;
  accountsHighlitedPics: Source[];
  tipsCounter: number;
  likesCounter: number;
  handlePressCounters: () => void;
};

const InteractionCountersBar = ({
  loading,
  accountsHighlitedPics,
  tipsCounter,
  likesCounter,
  handlePressCounters,
}: Props) => {
  const styles = useStyles();
  const theme = useTheme();
  const {t} = useTranslation('postDetails');
  // TODO i dont like this but i had not found any better idea
  const calculatedWidth =
    accountsHighlitedPics.length === 1
      ? 30
      : accountsHighlitedPics.length === 2
      ? 50
      : 70;

  return loading ? (
    <ActivityIndicator color={theme.colors.surfaceBlack} />
  ) : (
    <View style={styles.container}>
      <TouchableOpacity onPress={handlePressCounters} style={styles.button}>
        {accountsHighlitedPics[0] && (
          <View style={{width: calculatedWidth, height: 30}}>
            {accountsHighlitedPics[0] && (
              <FastImage
                source={accountsHighlitedPics[0]}
                style={styles.icon1}
              />
            )}
            {accountsHighlitedPics[1] && (
              <FastImage
                source={accountsHighlitedPics[1]}
                style={styles.icon2}
              />
            )}
            {accountsHighlitedPics[2] && (
              <FastImage
                source={accountsHighlitedPics[2]}
                style={styles.icon3}
              />
            )}
          </View>
        )}
        <Typography.Button2 style={styles.text}>
          {t('likes and tips', {likesCounter, tipsCounter})}
        </Typography.Button2>
      </TouchableOpacity>
    </View>
  );
};

export default InteractionCountersBar;
