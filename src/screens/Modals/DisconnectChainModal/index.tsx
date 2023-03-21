import React from 'react';
import { Image, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Typography from 'components/Typography';
import { desmosIcon, disconnectIcon, dummyAvatar, errorImage, modalSuccess } from 'assets/images';
import Button from 'components/CustomButton';
import { StackScreenProps } from '@react-navigation/stack';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ChainLink } from 'types/desmos';
import { MsgUnlinkChainAccount } from '@desmoslabs/desmjs-types/desmos/profiles/v3/msgs_chain_links';
import useBroadcastTx from 'hooks/transactions/useBroadcastTx';
import { useActiveAccount } from '@recoil/accounts';
import {
  MsgUnlinkChainAccountEncodeObject,
  MsgUnlinkChainAccountTypeUrl,
} from '@desmoslabs/desmjs';
import { isCanceledOperationError } from 'types/error';
import LinkableChains from 'config/LinkableChains';
import useNavigateToProfile from 'hooks/navigation/useNavigateToProfile';
import useStyles from './useStyles';

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.DISCONNECT_CHAIN_MODAL>;

export type DisconnectChainParams = {
  chainLink: ChainLink;
};

const DisconnectChainModal = () => {
  const { t } = useTranslation('disconnectChain');
  const theme = useTheme();
  const styles = useStyles();

  const { goBack, navigate } = useNavigation<NavProps['navigation']>();
  const { params } = useRoute<NavProps['route']>();
  const { chainLink } = params;

  // -------------------------------------------------------------------------------------
  // --- Hooks
  // -------------------------------------------------------------------------------------

  const navigateToProfile = useNavigateToProfile();

  const activeAccount = useActiveAccount();
  const broadcastTx = useBroadcastTx();

  const chain = React.useMemo(() => {
    return LinkableChains.find(x => x.name.toLowerCase() === chainLink.chainName.toLowerCase());
  }, [chainLink]);

  // -------------------------------------------------------------------------------------
  // --- Actions
  // -------------------------------------------------------------------------------------

  const handlePressYes = React.useCallback(async () => {
    if (!activeAccount) return;

    // Create the message
    const msgUnlinkChainAccount: MsgUnlinkChainAccountEncodeObject = {
      typeUrl: MsgUnlinkChainAccountTypeUrl,
      value: MsgUnlinkChainAccount.fromPartial({
        chainName: chainLink.chainName,
        owner: activeAccount!.address,
        target: chainLink.externalAddress,
      }),
    };

    // Broadcast the transaction
    const broadcastResult = await broadcastTx([msgUnlinkChainAccount], { onChain: true });

    if (broadcastResult.isOk()) {
      navigate(ROUTES.CONFIRM_MODAL, {
        image: modalSuccess,
        title: t('common:success'),
        subtitle: t('resultModal:yourChainLinkDisconnected', {
          chainLink: chainLink.chainName.toUpperCase(),
        }),
        primaryButtonLabel: t('resultModal:goToProfile') as string,
        onPressPrimary: navigateToProfile,
      });
    } else if (!isCanceledOperationError(broadcastResult.error)) {
      navigate(ROUTES.CONFIRM_MODAL, {
        title: t('common:failed'),
        image: errorImage,
        subtitle: t('resultModal:yourChainLinkDisconnected', {
          chainLink: chainLink.chainName.toUpperCase(),
        }),
        primaryButtonLabel: t('common:retry') as string,
        onPressPrimary: handlePressYes,
        secondaryButtonMode: 'outlined',
        secondaryButtonLabel: t('resultModal:goToProfile') as string,
        onPressSecondary: navigateToProfile,
      });
    }
  }, [
    activeAccount,
    broadcastTx,
    chainLink.chainName,
    chainLink.externalAddress,
    navigate,
    navigateToProfile,
    t,
  ]);

  // -------------------------------------------------------------------------------------
  // --- View rendering
  // -------------------------------------------------------------------------------------

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

        <Button
          size={44}
          style={styles.confirmButton}
          backgroundColor={theme.colors.surfaceBlack}
          textColor={theme.colors.white}
          onPress={handlePressYes}>
          {t('common:yes')}
        </Button>

        <Button variant="outlined" size={44} style={styles.cancelButton} onPress={goBack}>
          {t('common:no')}
        </Button>
      </View>
    </View>
  );
};

export default DisconnectChainModal;
