import { twitterIcon } from 'assets/images';
import Typography from 'components/Typography';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useTheme } from 'native-base';
import { scale } from 'react-native-size-matters';
import { ApplicationLink, ChainLink } from 'types/desmos';
import { useActiveAccountAddress } from '@recoil/accounts';
import { getChainLinkImage } from 'lib/ProfileUtils';
import useStyles from './useStyles';

export interface SocialAndWalletsCountersBarProps {
  /**
   * Address of the user to which the links are connected.
   */
  readonly address: string;
  /**
   * Whether the data is loading or not.
   */
  readonly loading: boolean;
  /**
   * Links to external applications;
   */
  readonly appLinks: ApplicationLink[];
  /**
   * Links to external chain wallets.
   */
  readonly chainLinks: ChainLink[];
  /**
   * Action to be performed when the user presses the counters.
   */
  readonly handlePressCounters: () => void;
}

/**
 * Component to show the number of connected wallets and social links.
 * @constructor
 */
const SocialAndWalletsCountersBar = (props: SocialAndWalletsCountersBarProps) => {
  const styles = useStyles();
  const theme = useTheme();
  const { t } = useTranslation('profile');

  const { address, loading: isLoading, appLinks, chainLinks, handlePressCounters } = props;

  const activeAccountAddress = useActiveAccountAddress();
  const isGuestProfile = activeAccountAddress !== address;

  const twitterAppLink = appLinks.find(x => x.application === 'Twitter');
  const hasTwitterLink = twitterAppLink !== undefined;
  const hasChainLinks = chainLinks.length > 0;

  return isLoading ? (
    <View style={{ alignSelf: 'flex-start', left: 26, height: scale(18) }}>
      <ActivityIndicator color={theme.colors.surfaceBlack} />
    </View>
  ) : (
    <View style={[styles.container, { height: scale(18) }]}>
      <TouchableOpacity
        onPress={isGuestProfile ? undefined : handlePressCounters}
        style={styles.button}>
        {/* Twitter information */}
        {hasTwitterLink && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <FastImage source={twitterIcon} style={styles.iconStyle} />
            <Typography.Body6 style={{ marginLeft: 4 }}>{twitterAppLink.username}</Typography.Body6>
          </View>
        )}

        {/* Separator */}
        {hasTwitterLink && hasChainLinks && (
          <Typography.Body6 style={{ marginHorizontal: 4 }}>&</Typography.Body6>
        )}

        {/* Connected chains images */}
        {hasChainLinks && (
          <View
            style={{
              flexDirection: 'row',
              marginRight: -10 * chainLinks.length,
            }}>
            {chainLinks.map((x, idx) => (
              <FastImage
                key={`${x.toString()}-${Math.random()}`}
                source={getChainLinkImage(x)}
                style={[styles.iconStyle, { left: -10 * idx }]}
              />
            ))}
          </View>
        )}

        {/* Chain links counter */}
        <Typography.Body6 style={styles.text}>
          {t('connectedWallet', { count: chainLinks.length })}
        </Typography.Body6>
      </TouchableOpacity>
    </View>
  );
};

export default SocialAndWalletsCountersBar;
