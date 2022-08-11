import {StackScreenProps} from '@react-navigation/stack';
import Button from 'components/Button';
import DView from 'components/DView';
import GradientBorder from 'components/GradientBorder';
import TopBar from 'components/TopBar';
import Typography from 'components/Typography';
import useChainLinks from 'hooks/useChainLinks';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {FlatList, ListRenderItemInfo, View} from 'react-native';
import {Snackbar} from 'react-native-paper';
import ChainLinkItem from 'screens/ManageConnectedChains/components/ChainLinkItem';
import NoConnections from 'screens/ManageConnectedChains/components/NoConnections';
import {ChainLink} from 'types/link';
import ROUTES from 'navigation/routes';
import {useNavigation} from '@react-navigation/native';
import useUnlockWallet from 'hooks/useUnlockWallet';
import useActiveAccount from 'hooks/useActiveAccount';
import useDisconnectChainLink from 'hooks/useDisconnectChainlink';
import {modalSuccess} from 'assets/images';
import useStyles from './useStyles';

type NavProps = StackScreenProps<
  RootNavigatorParamList,
  ROUTES.MANAGE_CONNECTED_CHAINS
>;

const ManageConnectedChains = () => {
  const {t} = useTranslation('manageChains');
  const styles = useStyles();

  const {navigate} = useNavigation<NavProps['navigation']>();

  const {refetch, chainLinks} = useChainLinks();
  const [showSnackbar, setShowSnackbar] = React.useState(false);

  // disconnect chain - (remove once merged)
  const {chainAccount} = useActiveAccount();
  const unlockWallet = useUnlockWallet();
  const disconnectChainLink = useDisconnectChainLink();

  const handlePressDisconnectChainLink = React.useCallback(
    (chainLink: ChainLink) => async () => {
      if (!chainAccount) return;

      const unlockResponse = await unlockWallet(chainAccount);

      if (!unlockResponse || !unlockResponse.signer) return;
      await disconnectChainLink(unlockResponse.signer, chainLink);
      // we want the refetch call to run while the user is shown the sucess dialog.
      refetch();

      navigate(ROUTES.RESULT_MODAL, {
        image: modalSuccess,
        primaryButtonLabel: t('resultModal:goToProfile') as string,
        onPressPrimary: () => navigate(ROUTES.USER_PROFILE),
      });
    },
    [chainAccount],
  );
  // end disconnect chain

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
    [],
  );

  const ListEmptyComponent = React.useMemo(() => {
    return (
      <View>
        <NoConnections />

        <View style={styles.buttonContainer}>
          <Button
            onPress={() => navigate(ROUTES.SELECT_CHAIN)}
            mode="gradientFilled"
            labelStyle={styles.buttonStyle}>
            {t('profile:connectAddress')}
          </Button>
        </View>
      </View>
    );
  }, []);

  // This screen usings a combination of GradientBorder and zIndexWrapper to create
  // a pleasant scrolling experience while on ios. Without it, the dropshadow would
  // appear cut off during overscroll
  return (
    <DView topBar={<TopBar />}>
      <View style={styles.zIndexWrapper}>
        <View style={styles.textContainer}>
          <Typography.H3>{t('connectedAddresses')}</Typography.H3>

          <Typography.Body6 style={styles.descriptionText}>
            {t('description')}
          </Typography.Body6>
        </View>

        <GradientBorder height={15} />
      </View>

      <FlatList
        data={chainLinks}
        renderItem={renderChainLinks}
        ListEmptyComponent={ListEmptyComponent}
        contentContainerStyle={styles.flatListContainer}
        style={{overflow: 'visible'}}
      />

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
