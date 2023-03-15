import { useNavigation, useRoute } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { connectTwitterProfileIcon, manageConnectedTwitterProfileIcon } from 'assets/images';
import BottomUpModalWrapper from 'components/BottomUpModalWrapper';
import Spacer from 'components/Spacer';
import Typography from 'components/Typography';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import { Divider, useTheme } from 'native-base';
import { ApplicationLink } from 'types/desmos';
import useStyles from './useStyles';

export interface ManageConnectionsModalParams {
  readonly appLinks: ApplicationLink[];
}

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.MANAGE_CONNECTIONS_MODAL>;

/**
 * Modal that allows to manage the connected external applications and wallets.
 * @constructor
 */
const ManageConnectionsModal = () => {
  const styles = useStyles();
  const theme = useTheme();
  const { t } = useTranslation('profile');

  const { goBack, navigate } = useNavigation<NavProps['navigation']>();
  const { params } = useRoute<NavProps['route']>();
  const { appLinks } = params;

  // TODO: fixme
  const onPressConnectTwitter = useCallback(() => {
    goBack();
    /*    setTimeout(
      () =>
        navigate(ROUTES.CONNECT_APP, {
          mode: 'connect',
        }),
      200,
    ); */
  }, [goBack]);

  const onPressManageConnectedTwitter = useCallback(() => {
    goBack();
    setTimeout(() => navigate(ROUTES.MANAGE_CONNECTED_APPS), 200);
  }, [goBack, navigate]);

  return (
    <BottomUpModalWrapper goBack={goBack}>
      {/* Button to connect Twitter */}
      <TouchableOpacity style={styles.button} onPress={onPressConnectTwitter}>
        <FastImage
          source={connectTwitterProfileIcon}
          style={styles.image}
          tintColor={theme.colors.butterOrange01}
        />
        <Typography.Body6>{t('connectTwitter')}</Typography.Body6>
      </TouchableOpacity>
      {appLinks.length > 0 && (
        <>
          <TouchableOpacity style={styles.button} onPress={onPressManageConnectedTwitter}>
            <FastImage
              source={manageConnectedTwitterProfileIcon}
              style={styles.image}
              tintColor={theme.colors.butterOrange01}
            />
            <Typography.Body6>{t('manageConnectedTwitter')}</Typography.Body6>
          </TouchableOpacity>
          <Divider style={styles.divider} />
        </>
      )}
      <Spacer paddingBottom={theme.spacing.l} />
    </BottomUpModalWrapper>
  );
};

export default ManageConnectionsModal;
