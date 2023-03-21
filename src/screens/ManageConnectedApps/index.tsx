import { StackScreenProps } from '@react-navigation/stack';
import Button from 'components/CustomButton';
import DView from 'components/DView';
import GradientBorder from 'components/GradientBorder';
import Spacer from 'components/Spacer';
import TopBar from 'components/TopBar';
import Typography from 'components/Typography';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, FlatList, ListRenderItemInfo, View } from 'react-native';
import { useTheme } from 'native-base';
import AppConnectedItem from 'screens/ManageConnectedApps/components/AppConnectedItem';
import NoAppConnections from 'screens/ManageConnectedApps/components/NoConnections';
import { useActiveAccount } from '@recoil/accounts';
import { ApplicationLink } from 'types/desmos';
import useAppLinksGivenAddress from 'hooks/profiles/applinks/useAppLinksGivenAddress';
import { useCreateAppLink, useUnlinkApplication } from './hooks';
import useStyles from './useStyles';

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.MANAGE_CONNECTED_APPS>;

const ManageConnectedApps: React.FC<NavProps> = () => {
  const { t } = useTranslation('connectApp');
  const styles = useStyles();
  const theme = useTheme();
  const activeAccount = useActiveAccount()!;
  const unlinkApplication = useUnlinkApplication();
  const createAppLink = useCreateAppLink();
  const { appLinks, loading } = useAppLinksGivenAddress(activeAccount.address);

  const renderChainLinks = React.useCallback(
    ({ item }: ListRenderItemInfo<ApplicationLink>) => {
      return (
        <AppConnectedItem
          applicationLink={item}
          onPressDisconnect={() => unlinkApplication(item)}
        />
      );
    },
    [unlinkApplication],
  );

  const ListEmptyComponent = React.useMemo(() => {
    return (
      <Spacer paddingTop={120}>
        <NoAppConnections />
        <View style={styles.buttonContainer}>
          <Button
            textColor={theme.colors.white}
            backgroundColor={theme.colors.surfaceBlack}
            onPress={createAppLink}
            size={44}>
            {t('connect app')}
          </Button>
        </View>
      </Spacer>
    );
  }, [createAppLink]);

  const ItemSeparatorComponent = React.useCallback(
    () => <Spacer paddingVertical={theme.spacing.s} />,
    [theme.spacing.s],
  );

  return (
    <DView topBar={<TopBar />}>
      <View style={styles.zIndexWrapper}>
        <View style={styles.textContainer}>
          <Typography.H4>{t('connectedApps')}</Typography.H4>
        </View>

        <GradientBorder height={5} />
      </View>

      {loading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={appLinks}
          renderItem={renderChainLinks}
          ListEmptyComponent={ListEmptyComponent}
          contentContainerStyle={styles.flatListContainer}
          ItemSeparatorComponent={ItemSeparatorComponent}
          style={{ overflow: 'visible' }}
        />
      )}
    </DView>
  );
};

export default ManageConnectedApps;
