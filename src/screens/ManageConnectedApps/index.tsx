import {MsgUnlinkApplicationEncodeObject} from '@desmoslabs/desmjs';
import {useNavigation} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {connectedAppsState} from '@recoil/connectedApps';
import {modalSuccess} from 'assets/images';
import DView from 'components/DView';
import GradientBorder from 'components/GradientBorder';
import Spacer from 'components/Spacer';
import TopBar from 'components/TopBar';
import Typography from 'components/Typography';
import useActiveAccount from 'hooks/useActiveAccount';
import useUnlockWallet from 'hooks/useUnlockWallet';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {FlatList, ListRenderItemInfo, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useRecoilState} from 'recoil';
import AppConnectedItem from 'screens/ManageConnectedApps/components/AppConnectedItem';
import NoAppConnections from 'screens/ManageConnectedApps/components/NoConnections';
import useStyles from './useStyles';

type NavProps = StackScreenProps<
  RootNavigatorParamList,
  ROUTES.MANAGE_CONNECTED_APPS
>;

const ManageConnectedApps = () => {
  const {t} = useTranslation('connectApp');
  const styles = useStyles();
  const theme = useTheme();
  const {navigate} = useNavigation<NavProps['navigation']>();
  const [connectedApps] = useRecoilState(connectedAppsState);
  const {chainAccount} = useActiveAccount();
  const unlockWallet = useUnlockWallet();

  const successDisconnection = React.useCallback((appName: string) => {
    navigate(ROUTES.RESULT_MODAL, {
      image: modalSuccess,
      title: t('resultModal:success'),
      subtitle: t('resultModal:appDisconnected', {
        appName,
      }),
      primaryButtonLabel: t('resultModal:goToProfile') as string,
      onPressPrimary: () => {
        navigate(ROUTES.USER_PROFILE);
      },
    });
  }, []);

  const disconnectApplication = useCallback(
    async (appName: string, username: string) => {
      if (!chainAccount) return;
      try {
        const result = await unlockWallet({chainAccount});

        if (result && result.wallet) {
          const accounts = await result.wallet.getAccounts();
          const msg: MsgUnlinkApplicationEncodeObject = {
            typeUrl: '/desmos.profiles.v3.MsgUnlinkApplication',
            value: {
              application: appName,
              username,
              signer: accounts[0].address,
            },
          };
          navigate(ROUTES.BROADCAST_TX, {
            messages: [msg],
            offlineSigner: result.wallet,
            successAction: () => successDisconnection(appName),
          });
        }
      } catch (e: any) {
        console.log(e);
      }
    },
    [chainAccount, successDisconnection, unlockWallet],
  );

  const handlePressDisconnectApp = React.useCallback(
    (appName: string, username: string) => {
      navigate(ROUTES.DISCONNECT_APP_MODAL, {
        appName,
        onConfirmDisconnection: () => disconnectApplication(appName, username),
      });
    },
    [disconnectApplication],
  );

  const renderChainLinks = React.useCallback(
    (info: ListRenderItemInfo<ConnectedApps>) => {
      return (
        <AppConnectedItem
          appName={info.item.application}
          username={info.item.username}
          onPressDisconnect={() =>
            handlePressDisconnectApp(info.item.application, info.item.username)
          }
        />
      );
    },
    [handlePressDisconnectApp],
  );

  const ListEmptyComponent = React.useMemo(() => {
    return (
      <Spacer paddingTop={140}>
        <NoAppConnections />
      </Spacer>
    );
  }, []);

  const ItemSeparatorComponent = React.useCallback(
    () => <Spacer paddingVertical={theme.spacing.s} />,
    [],
  );

  return (
    <DView topBar={<TopBar />}>
      <View style={styles.zIndexWrapper}>
        <View style={styles.textContainer}>
          <Typography.H4>{t('connectedApps')}</Typography.H4>
        </View>

        <GradientBorder height={5} />
      </View>

      <FlatList
        data={connectedApps}
        renderItem={renderChainLinks}
        ListEmptyComponent={ListEmptyComponent}
        contentContainerStyle={styles.flatListContainer}
        ItemSeparatorComponent={ItemSeparatorComponent}
        style={{overflow: 'visible'}}
      />
    </DView>
  );
};

export default ManageConnectedApps;
