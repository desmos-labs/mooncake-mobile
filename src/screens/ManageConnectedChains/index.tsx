import { StackScreenProps } from '@react-navigation/stack';
import Button from 'components/Button';
import DView from 'components/DView';
import GradientBorder from 'components/GradientBorder';
import Spacer from 'components/Spacer';
import TopBar from 'components/TopBar';
import Typography from 'components/Typography';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, FlatList, ListRenderItemInfo, View } from 'react-native';
import { Snackbar, useTheme } from 'react-native-paper';
import ChainLinkItem from 'screens/ManageConnectedChains/components/ChainLinkItem';
import NoConnections from 'screens/ManageConnectedChains/components/NoConnections';
import { ChainLink } from 'types/desmos';
import ROUTES from 'navigation/routes';
import { useNavigation } from '@react-navigation/native';
import ImageButton from 'components/ImageButton';
import { addButton } from 'assets/images';
import useChainLinksGivenAddress from 'hooks/useChainLinksGivenAddress';
import useStyles from './useStyles';

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.MANAGE_CONNECTED_CHAINS>;

const ManageConnectedChains = () => {
  const { t } = useTranslation('manageChains');
  const styles = useStyles();
  const theme = useTheme();
  const { navigate } = useNavigation<NavProps['navigation']>();
  const [showSnackbar, setShowSnackbar] = React.useState(false);
  const { chainLinks, loading, refetch } = useChainLinksGivenAddress();

  useEffect(() => {
    refetch();

    // Safe to ignore, we need to fetch the chain link just the first time that
    // we enter this screen.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePressDisconnectChainLink = React.useCallback(
    (chainLink: ChainLink) => async () => {
      navigate(ROUTES.DISCONNECT_CHAIN_MODAL, {
        chainLink,
      });
    },
    [navigate],
  );

  const renderChainLinks = React.useCallback(
    (info: ListRenderItemInfo<ChainLink>) => {
      return (
        <ChainLinkItem
          chainName={info.item.chainName}
          address={info.item.externalAddress}
          onPressDisconnect={handlePressDisconnectChainLink(info.item)}
          showSnackBar={() => setShowSnackbar(true)}
        />
      );
    },
    [handlePressDisconnectChainLink],
  );

  const ListEmptyComponent = React.useMemo(() => {
    return (
      <Spacer paddingTop={80}>
        <NoConnections />

        <View style={styles.buttonContainer}>
          <Button
            color={theme.colors.surfaceBlack}
            onPress={() => navigate(ROUTES.SELECT_CHAIN)}
            mode="contained"
            labelStyle={styles.buttonStyle}>
            {t('profile:connectAddress')}
          </Button>
        </View>
      </Spacer>
    );
  }, []);

  const ItemSeparatorComponent = React.useCallback(
    () => <Spacer paddingVertical={theme.spacing.s} />,
    [],
  );

  // This screen usings a combination of GradientBorder and zIndexWrapper to create
  // a pleasant scrolling experience while on ios. Without it, the dropshadow would
  // appear cut off during overscroll
  return (
    <DView topBar={<TopBar />}>
      <View style={styles.zIndexWrapper}>
        <View style={styles.textContainer}>
          <View style={styles.headerTextGroup}>
            <Typography.H4 style={{ flex: 1 }}>{t('connectedAddresses')}</Typography.H4>

            <ImageButton
              onPress={() => {
                navigate(ROUTES.SELECT_CHAIN);
              }}
              image={addButton}
              style={styles.addConnectionButton}
            />
          </View>

          <Typography.Body5 style={styles.descriptionText}>{t('description')}</Typography.Body5>
        </View>

        <GradientBorder height={5} />
      </View>

      {loading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={chainLinks}
          renderItem={renderChainLinks}
          ListEmptyComponent={ListEmptyComponent}
          contentContainerStyle={styles.flatListContainer}
          ItemSeparatorComponent={ItemSeparatorComponent}
          style={{ overflow: 'visible' }}
        />
      )}
      <Snackbar
        visible={showSnackbar}
        style={styles.snackbar}
        onDismiss={() => setShowSnackbar(false)}
        action={{
          label: t('hide'),
        }}
        duration={Snackbar.DURATION_SHORT}>
        <Typography.Caption1>{t('common:addressCopied')}</Typography.Caption1>
      </Snackbar>
    </DView>
  );
};

export default ManageConnectedChains;
