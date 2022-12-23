import {useNavigation, useRoute} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {
  connectTwitterProfileIcon,
  connectWalletProfileIcon,
  manageConnectedTwitterProfileIcon,
  manageConnectedWalletsProfileIcon,
} from 'assets/images';
import BottomUpModalWrapper from 'components/BottomUpModalWrapper';
import Spacer from 'components/Spacer';
import Typography from 'components/Typography';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Divider, useTheme} from 'react-native-paper';
import useStyles from './useStyles';

export type ManageConnectionsModalParams = {
  appsConnected: boolean;
  chainsConnected: boolean;
};

type NavProps = StackScreenProps<
  RootNavigatorParamList,
  ROUTES.MANAGE_CONNECTIONS_MODAL
>;

const ManageConnectionsModal = () => {
  const {
    params: {appsConnected, chainsConnected},
  } = useRoute<NavProps['route']>();
  const styles = useStyles();
  const theme = useTheme();
  const {t} = useTranslation('profile');
  const {goBack, navigate} = useNavigation<NavProps['navigation']>();

  const onPressFirstButton = useCallback(() => {
    goBack();
    setTimeout(() => navigate(ROUTES.CONNECT_APP, {mode: 'connect'}), 200);
  }, []);

  const onPressSecondButton = useCallback(() => {
    goBack();
    setTimeout(() => navigate(ROUTES.SELECT_CHAIN), 200);
  }, []);

  const onPressThirdButton = useCallback(() => {
    goBack();
    setTimeout(() => navigate(ROUTES.MANAGE_CONNECTED_APPS), 200);
  }, []);

  const onPressFourthButton = useCallback(() => {
    goBack();
    setTimeout(() => navigate(ROUTES.MANAGE_CONNECTED_CHAINS), 200);
  }, []);

  return (
    <BottomUpModalWrapper goBack={goBack}>
      <TouchableOpacity style={styles.button} onPress={onPressFirstButton}>
        <FastImage
          source={connectTwitterProfileIcon}
          style={styles.image}
          tintColor={theme.colors.butterOrange01}
        />
        <Typography.Body6>{t('connectTwitter')}</Typography.Body6>
      </TouchableOpacity>
      <Divider style={styles.divider} />
      <TouchableOpacity style={styles.button} onPress={onPressSecondButton}>
        <FastImage
          source={connectWalletProfileIcon}
          style={styles.image}
          tintColor={theme.colors.butterOrange01}
        />
        <Typography.Body6>{t('connectWallet')}</Typography.Body6>
      </TouchableOpacity>
      <Divider style={styles.divider} />
      {appsConnected && (
        <>
          <TouchableOpacity style={styles.button} onPress={onPressThirdButton}>
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
      {chainsConnected && (
        <>
          <TouchableOpacity style={styles.button} onPress={onPressFourthButton}>
            <FastImage
              source={manageConnectedWalletsProfileIcon}
              style={styles.image}
            />
            <Typography.Body6>{t('manageConnectedWallets')}</Typography.Body6>
          </TouchableOpacity>
          <Divider style={styles.divider} />
        </>
      )}
      <Spacer paddingBottom={theme.spacing.l} />
    </BottomUpModalWrapper>
  );
};

export default ManageConnectionsModal;
