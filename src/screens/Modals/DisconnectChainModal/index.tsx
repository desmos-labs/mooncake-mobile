import React from 'react';
import { Image, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Typography from 'components/Typography';
import { desmosIcon, disconnectIcon, dummyAvatar, errorImage, modalSuccess } from 'assets/images';
import Button from 'components/Button';
import { StackScreenProps } from '@react-navigation/stack';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ChainLink } from 'types/desmos';
import LinkableChains from 'config/LinkableChains';
import { MsgUnlinkChainAccount } from '@desmoslabs/desmjs-types/desmos/profiles/v3/msgs_chain_links';
import useBroadcastTx from 'hooks/useBroadcastTx';
import { useActiveAccount } from '@recoil/accounts';
import { MsgUnlinkChainAccountTypeUrl } from '@desmoslabs/desmjs';
import { isCanceledOperationError } from 'types/error';
import useStyles from './useStyles';

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.DISCONNECT_CHAIN_MODAL>;

export type DisconnectChainParams = {
  chainLink: ChainLink;
};

const DisconnectChainModal = () => {
  const styles = useStyles();
  const { goBack, navigate } = useNavigation<NavProps['navigation']>();
  const broadcastTx = useBroadcastTx();

  const {
    params: { chainLink },
  } = useRoute<NavProps['route']>();

  const { t } = useTranslation('disconnectChain');
  const activeAccount = useActiveAccount();

  const chain = React.useMemo(() => {
    return LinkableChains.find(x => x.name.toLowerCase() === chainLink.chainName.toLowerCase());
  }, [chainLink]);

  const handlePressYes = React.useCallback(async () => {
    if (!activeAccount) return;
    const msgUnlinkChainAccount = [
      {
        typeUrl: MsgUnlinkChainAccountTypeUrl,
        value: MsgUnlinkChainAccount.fromPartial({
          chainName: chainLink.chainName,
          owner: activeAccount!.address,
          target: chainLink.externalAddress,
        }),
      },
    ];

    const broadcastResult = await broadcastTx(msgUnlinkChainAccount, {
      onChain: true,
    });

    if (broadcastResult.isOk()) {
      navigate(ROUTES.CONFIRM_MODAL, {
        image: modalSuccess,
        title: t('common:success'),
        subtitle: t('resultModal:yourChainLinkDisconnected', {
          chainLink: chainLink.chainName.toUpperCase(),
        }),
        primaryButtonLabel: t('resultModal:goToProfile') as string,
        onPressPrimary: () =>
          navigate(ROUTES.BOTTOM_TABS, {
            screen: ROUTES.PROFILE,
          }),
      });
    } else if (!isCanceledOperationError(broadcastResult.error)) {
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
            screen: ROUTES.PROFILE,
          }),
      });
    }
  }, [activeAccount, broadcastTx, chainLink.chainName, chainLink.externalAddress, navigate, t]);

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <Typography.H5 style={styles.textStyle}>{t('disconnect')}</Typography.H5>

        <View style={styles.chainImageGroup}>
          <Image source={chain ? chain.icon : dummyAvatar} style={styles.chainIcon} />
          <Image source={disconnectIcon} style={styles.disconnectIcon} />
          <Image source={desmosIcon} style={styles.chainIcon} />
        </View>

        <Typography.Body5 style={styles.textStyle}>{t('areYouSure')}</Typography.Body5>
        <Typography.Button2 style={styles.textStyle}>
          {chainLink.externalAddress}
        </Typography.Button2>

        <Button style={styles.confirmButton} mode="contained" onPress={handlePressYes}>
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
