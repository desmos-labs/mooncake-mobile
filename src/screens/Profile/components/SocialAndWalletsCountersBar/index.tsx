import { twitterIcon } from 'assets/images';
import Typography from 'components/Typography';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { Box, HStack } from 'native-base';
import { scale } from 'react-native-size-matters';
import { ApplicationLink, ChainLink } from 'types/desmos';
import { useActiveAccountAddress } from '@recoil/accounts';
import { getChainLinkImage } from 'lib/ProfileUtils';
import StyledSpinner from 'components/StyledSpinner';
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
  const { t } = useTranslation('profile');

  const { address, loading: isLoading, appLinks, chainLinks, handlePressCounters } = props;

  const activeAccountAddress = useActiveAccountAddress();
  const isGuestProfile = activeAccountAddress !== address;

  const twitterAppLink = appLinks.find(x => x.application === 'Twitter');
  const hasTwitterLink = twitterAppLink !== undefined;
  const hasChainLinks = chainLinks.length > 0;

  return isLoading ? (
    <View style={styles.loadingContainer}>
      <StyledSpinner />
    </View>
  ) : (
    <View style={[styles.container, { height: scale(18) }]}>
      <TouchableOpacity
        onPress={isGuestProfile ? undefined : handlePressCounters}
        style={styles.button}>
        {/* Twitter information */}
        {hasTwitterLink && (
          <HStack alignItems="center">
            <FastImage source={twitterIcon} style={styles.iconStyle} />
            <Box ml="xs">
              <Typography.Body6>{twitterAppLink.username}</Typography.Body6>
            </Box>
          </HStack>
        )}

        {/* Separator */}
        {hasTwitterLink && hasChainLinks && (
          <Box mx="xs">
            <Typography.Body6>&</Typography.Body6>
          </Box>
        )}

        {/* Connected chains images */}
        {hasChainLinks && (
          <HStack
            // dynamic margin right calculation is left as an inline style as it behaves more
            // predictably than using HStack's mr prop
            style={{
              marginRight: -10 * chainLinks.length,
            }}>
            {chainLinks.map((x, idx) => (
              <FastImage
                key={`${x.toString()}-${Math.random()}`}
                source={getChainLinkImage(x)}
                style={[styles.iconStyle, { left: -10 * idx }]}
              />
            ))}
          </HStack>
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
