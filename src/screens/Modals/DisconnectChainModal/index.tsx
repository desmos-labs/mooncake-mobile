import React from 'react';
import {Image, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import Typography from 'components/Typography';
import {
  desmosIcon,
  disconnectIcon,
  dummyAvatar,
  errorImage,
  modalSuccess,
} from 'assets/images';
import Button from 'components/Button';
import {StackScreenProps} from '@react-navigation/stack';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import {useNavigation, useRoute} from '@react-navigation/native';
import {ChainLink} from 'types/link';
import LinkableChains from 'config/LinkableChains';
import {MsgUnlinkChainAccount} from '@desmoslabs/desmjs-types/desmos/profiles/v3/msgs_chain_links';
import useUnlockWallet from 'hooks/useUnlockWallet';
import useActiveAccount from 'hooks/useActiveAccount';
import useStyles from './useStyles';

type NavProps = StackScreenProps<
  RootNavigatorParamList,
  ROUTES.DISCONNECT_CHAIN_MODAL
>;

export type DisconnectChainParams = {
  chainLink: ChainLink;
};

const DisconnectChainModal = () => {
  const styles = useStyles();

  const {goBack, navigate} = useNavigation<NavProps['navigation']>();

  const {
    params: {chainLink},
  } = useRoute<NavProps['route']>();

  const {t} = useTranslation('disconnectChain');
  const {chainAccount} = useActiveAccount();

  const unlockWallet = useUnlockWallet();

  const chain = React.useMemo(() => {
    return LinkableChains.find(
      x => x.name.toLowerCase() === chainLink.chainName.toLowerCase(),
    );
  }, [chainLink]);

  const handlePressYes = React.useCallback(async () => {
    if (!chainAccount) return;

    const unlockResponse = await unlockWallet({chainAccount});

    if (!unlockResponse || !unlockResponse.wallet) return;

    const {wallet} = unlockResponse;

    const accounts = await wallet.getAccounts();

    const msgs = [
      {
        typeUrl: '/desmos.profiles.v3.MsgUnlinkChainAccount',
        value: MsgUnlinkChainAccount.fromPartial({
          chainName: chainLink.chainName,
          owner: accounts[0].address,
          target: chainLink.externalAddress,
        }),
      },
    ];

    navigate(ROUTES.BROADCAST_TX, {
      messages: msgs,
      offlineSigner: unlockResponse.wallet,
      successAction: () => {
        navigate(ROUTES.CONFIRM_MODAL, {
          image: modalSuccess,
          title: t('common:success'),
          subtitle: t('resultModal:yourChainLinkDisconnected', {
            chainLink: chainLink.chainName.toUpperCase(),
          }),
          primaryButtonLabel: t('resultModal:goToProfile') as string,
          onPressPrimary: () =>
            navigate(ROUTES.BOTTOM_TABS, {
              screen: ROUTES.USER_PROFILE,
            }),
        });
      },
      failureAction: () => {
        navigate(ROUTES.CONFIRM_MODAL, {
          title: t('common:failed'),
          image: errorImage,
          subtitle: t('resultModal:yourChainLinkDisconnected', {
            chainLink: chainLink.chainName.toUpperCase(),
          }),
          primaryButtonLabel: t('common:retry') as string,
          onPressPrimary: () => handlePressYes(),
          secondaryButtonMode: 'outlined',
          secondaryButtonLabel: t('resultModal:goToProfile') as string,
          onPressSecondary: () =>
            navigate(ROUTES.BOTTOM_TABS, {
              screen: ROUTES.USER_PROFILE,
            }),
        });
      },
    });
  }, [chainAccount]);

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <Typography.H5 style={styles.textStyle}>
          {t('disconnect')}
        </Typography.H5>

        <View style={styles.chainImageGroup}>
          <Image
            source={chain ? chain.icon : dummyAvatar}
            style={styles.chainIcon}
          />
          <Image source={disconnectIcon} style={styles.disconnectIcon} />
          <Image source={desmosIcon} style={styles.chainIcon} />
        </View>

        <Typography.Body5 style={styles.textStyle}>
          {t('areYouSure')}
        </Typography.Body5>
        <Typography.Button2 style={styles.textStyle}>
          {chainLink.externalAddress}
        </Typography.Button2>

        <Button
          style={styles.confirmButton}
          mode="contained"
          onPress={handlePressYes}>
          {t('common:yes')}
        </Button>

        <Button
          mode="outlined"
          style={styles.cancelButton}
          labelStyle={styles.cancelText}
          onPress={goBack}>
          {t('common:no')}
        </Button>
      </View>
    </View>
  );
};

export default DisconnectChainModal;
