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
import { Divider, useTheme } from 'react-native-paper';
import { ApplicationLink, ChainLink } from 'types/desmos';
import useStyles from './useStyles';

export interface ManageConnectionsModalParams {
  readonly appLinks: ApplicationLink[];
  readonly chainLinks: ChainLink[];
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
    setTimeout(
      () =>
        navigate(ROUTES.CONNECT_APP, {
          mode: 'connect',
        }),
      200,
    );
  }, [goBack, navigate]);

  /*  const onPressConnectWallet = useCallback(() => {
    goBack();
    setTimeout(() => navigate(ROUTES.IMPORT_ACCOUNT_SELECT_CHAIN), 200);
  }, [goBack, navigate]); */

  const onPressManageConnectedTwitter = useCallback(() => {
    goBack();
    setTimeout(() => navigate(ROUTES.MANAGE_CONNECTED_APPS), 200);
  }, [goBack, navigate]);

  /*  const onPressManageConnectedWallets = useCallback(() => {
    goBack();
    setTimeout(() => navigate(ROUTES.MANAGE_CONNECTED_CHAINS), 200);
  }, [goBack, navigate]); */

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

      {/* Button to connect an external wallet removed in beta version */}
      {/*
      <Divider style={styles.divider} />
      <TouchableOpacity style={styles.button} onPress={onPressConnectWallet}>
        <FastImage
          source={connectWalletProfileIcon}
          style={styles.image}
          tintColor={theme.colors.butterOrange01}
        />
        <Typography.Body6>{t('connectWallet')}</Typography.Body6>
      </TouchableOpacity>
      <Divider style={styles.divider} />
      */}

      {/* Spacer */}

      {/* Buttons to manage the connected applications */}
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

      {/* Button to manage connected wallets removed in beta version */}
      {/*      {chainLinks.length > 0 && (
        <>
          <TouchableOpacity style={styles.button} onPress={onPressManageConnectedWallets}>
            <FastImage source={manageConnectedWalletsProfileIcon} style={styles.image} />
            <Typography.Body6>{t('manageConnectedWallets')}</Typography.Body6>
          </TouchableOpacity>
          <Divider style={styles.divider} />
        </>
      )} */}
      <Spacer paddingBottom={theme.spacing.l} />
    </BottomUpModalWrapper>
  );
};

export default ManageConnectionsModal;
