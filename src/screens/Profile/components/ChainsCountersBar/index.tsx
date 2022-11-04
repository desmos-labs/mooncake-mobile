import Typography from 'components/Typography';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {TouchableOpacity, View} from 'react-native';
import FastImage, {Source} from 'react-native-fast-image';
import {ActivityIndicator} from 'react-native-paper';
import useStyles from './useStyles';

type Props = {
  loading: boolean;
  connectedChainsImages: Source[];
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

  return loading ? (
    <ActivityIndicator />
  ) : (
    <View style={styles.container}>
      <TouchableOpacity onPress={handlePressCounters} style={styles.button}>
        {connectedChainsImages[0] && (
          <View
            style={{
              flexDirection: 'row',
              marginRight: -10 * connectedChainsImages.length,
            }}>
            {connectedChainsImages.map((x, idx) => (
              <FastImage
                key={`${x.toString()}-${Math.random()}`}
                source={x}
                style={[styles.iconStyle, {left: -10 * idx}]}
              />
            ))}
          </View>
        )}
        <Typography.Button2 style={styles.text}>
          {t('connectedChains', {count: connectedChainsCounter})} {t('and')}{' '}
          {t('connectedApps', {count: connectedAppsCounter})}
        </Typography.Button2>
      </TouchableOpacity>
    </View>
  );
};

export default ChainsCountersBar;
