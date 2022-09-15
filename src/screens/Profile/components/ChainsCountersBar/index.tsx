import Typography from 'components/Typography';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {Image, TouchableOpacity, View} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';
import useStyles from './useStyles';

type Props = {
  loading: boolean;
  connectedChainsImages: React.ComponentProps<typeof Image>['source'][];
  connectedChainsCounter: number;
  connectedAppsCounter: number;
  handlePressCounters: () => void;
};

const ChainsCountersBar = ({
  loading,
  connectedChainsImages,
  connectedChainsCounter,
  connectedAppsCounter,
  handlePressCounters,
}: Props) => {
  const styles = useStyles();
  const {t} = useTranslation('profile');
  // TODO i dont like this but i had not found any better idea
  const calculatedWidth =
    connectedChainsImages.length === 1
      ? 30
      : connectedChainsImages.length === 2
      ? 50
      : 70;

  return loading ? (
    <ActivityIndicator />
  ) : (
    <View style={styles.container}>
      <TouchableOpacity onPress={handlePressCounters} style={styles.button}>
        {connectedChainsImages[0] && (
          <View style={{width: calculatedWidth, height: 30}}>
            {connectedChainsImages[0] && (
              <Image source={connectedChainsImages[0]} style={styles.icon1} />
            )}
            {connectedChainsImages[1] && (
              <Image source={connectedChainsImages[1]} style={styles.icon2} />
            )}
            {connectedChainsImages[2] && (
              <Image source={connectedChainsImages[2]} style={styles.icon3} />
            )}
          </View>
        )}
        <Typography.Button2 style={styles.text}>
          {t('chains and apps connected', {
            connectedChainsCounter,
            connectedAppsCounter,
          })}
        </Typography.Button2>
      </TouchableOpacity>
    </View>
  );
};

export default ChainsCountersBar;
