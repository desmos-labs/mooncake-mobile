import {twitterIcon} from 'assets/images';
import Typography from 'components/Typography';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {ActivityIndicator, TouchableOpacity, View} from 'react-native';
import FastImage, {Source} from 'react-native-fast-image';
import {useTheme} from 'react-native-paper';
import {scale} from 'react-native-size-matters';
import useStyles from './useStyles';

type Props = {
  loading: boolean;
  connectedChainsImages: Source[];
  connectedChainsCounter: number;
  twitterUsername?: string;
  handlePressCounters: () => void;
  visitingProfile: boolean;
};

const SocialAndWalletsCountersBar = ({
  loading,
  connectedChainsImages,
  connectedChainsCounter,
  twitterUsername,
  handlePressCounters,
  visitingProfile,
}: Props) => {
  const styles = useStyles();
  const theme = useTheme();
  const {t} = useTranslation('profile');

  return loading ? (
    <View style={{alignSelf: 'flex-start', left: 26, height: scale(18)}}>
      <ActivityIndicator color={theme.colors.surfaceBlack} />
    </View>
  ) : (
    <View style={[styles.container, {height: scale(18)}]}>
      <TouchableOpacity
        onPress={visitingProfile ? undefined : handlePressCounters}
        style={styles.button}>
        {twitterUsername && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <FastImage source={twitterIcon} style={styles.iconStyle} />
            <Typography.Body6 style={{marginLeft: 4}}>
              {twitterUsername}
            </Typography.Body6>
          </View>
        )}
        {twitterUsername && connectedChainsImages[0] && (
          <Typography.Body6 style={{marginHorizontal: 4}}>&</Typography.Body6>
        )}
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
        <Typography.Body6 style={styles.text}>
          {t('connectedWallet', {count: connectedChainsCounter})}
        </Typography.Body6>
      </TouchableOpacity>
    </View>
  );
};

export default SocialAndWalletsCountersBar;
