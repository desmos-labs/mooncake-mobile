import { verifiedIcon } from 'assets/images';
import DropShadowWrapper from 'components/DropShadowWrapper';
import Typography from 'components/Typography';
import GetAppIcon from 'lib/GetAppIcon';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, TouchableOpacity, View } from 'react-native';
import { ApplicationLinkState } from '@desmoslabs/desmjs-types/desmos/profiles/v3/models_app_links';
import { ApplicationLink } from 'types/desmos';
import { HStack } from 'native-base';
import useStyles from './useStyles';

type Props = {
  /**
   * Application link to display.
   */
  applicationLink: ApplicationLink;
  /**
   * What to do when the user presses the Disconnect button.
   */
  onPressDisconnect: () => void;
};

const AppConnectedItem = ({ applicationLink, onPressDisconnect }: Props) => {
  const { t } = useTranslation('common');
  const styles = useStyles();

  return (
    <DropShadowWrapper
      outerShadowProps={{
        startColor: 'rgba(37, 87, 188, 0.05)',
        offset: [10, 20],
        distance: 40,
      }}
      innerShadowProps={{
        startColor: 'rgba(16, 24, 40, 0.05)',
        offset: [0, 1],
        distance: 10,
      }}>
      <View style={styles.container}>
        <Image style={styles.icon} source={GetAppIcon(applicationLink.application)} />

        <View style={styles.centerGroup}>
          <HStack>
            <Typography.H5 style={styles.baseText}>{applicationLink.username}</Typography.H5>
            {applicationLink.state ===
            ApplicationLinkState.APPLICATION_LINK_STATE_VERIFICATION_SUCCESS ? (
              <Image source={verifiedIcon} style={styles.verifiedIcon} />
            ) : (
              <Image source={verifiedIcon} style={styles.unverifiedIcon} />
            )}
          </HStack>

          <View style={styles.addressGroup}>
            <Typography.Body7 style={styles.baseText} numberOfLines={1} ellipsizeMode="middle">
              @{applicationLink.application}
            </Typography.Body7>
          </View>
        </View>

        <View style={styles.disconnectButton}>
          <TouchableOpacity onPress={onPressDisconnect}>
            <Typography.Subtitle4 style={styles.disconnectText}>
              {t('disconnect')}
            </Typography.Subtitle4>
          </TouchableOpacity>
        </View>
      </View>
    </DropShadowWrapper>
  );
};

export default AppConnectedItem;
