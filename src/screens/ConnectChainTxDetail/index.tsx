import React from 'react';
import DView from 'components/DView';
import TopBar from 'components/TopBar';
import Typography from 'components/Typography';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Image, View } from 'react-native';
import { connectIcon, desmosIcon, errorImage, modalSuccess } from 'assets/images';
import Button from 'components/Button';
import { StackScreenProps } from '@react-navigation/stack';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from 'react-native-paper';
import { useRecoilValue } from 'recoil';
import { connectChainState } from '@recoil/connectChainState';
import { getMMKV, MMKVKEYS } from 'lib/MMKVStorage';
import { MsgLinkChainAccount } from '@desmoslabs/desmjs-types/desmos/profiles/v3/msgs_chain_links';
import LocalWallet from 'lib/LocalWallet';
import { computeTxFees, messagesGas } from 'lib/desmos/fees';
import { formatFeeWithDenoms } from 'lib/FormatUtils';
import useUnlockWallet from 'hooks/useUnlockWallet';
import useActiveAccount from 'hooks/useActiveAccount';
import EnvConfig from 'config/EnvConfig';
import { MsgLinkChainAccountEncodeObject } from '@desmoslabs/desmjs';
import {
  Bech32Address,
  Proof,
} from '@desmoslabs/desmjs-types/desmos/profiles/v3/models_chain_links';
import { Any } from '@desmoslabs/desmjs-types/google/protobuf/any';
import useStyles from './useStyles';

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.CONNECT_CHAIN_TX_DETAIL>;

export type ConnectChainTxDetailParams = {
  proof: Proof;

  externalAddress: string;
};

const ConnectChainTxDetail = () => {
  const { t } = useTranslation('connectChainTxDetail');

  const { navigate, goBack } = useNavigation<NavProps['navigation']>();
  const {
    params: { proof, externalAddress },
  } = useRoute<NavProps['route']>();

  const { chainAccount } = useActiveAccount();

  const unlockWallet = useUnlockWallet();

  const { selectedChain } = useRecoilValue(connectChainState);

  const activeAddr = getMMKV<string>(MMKVKEYS.ACTIVE_ACCOUNT_ADDRESS);

  const styles = useStyles();
  const theme = useTheme();
  const [message, setMessage] = React.useState<any>(undefined);
  const [deserializedExternalWallet] = React.useState<LocalWallet | undefined>(undefined);

  React.useEffect(() => {
    const generateMessage = async () => {
      const value: MsgLinkChainAccount = MsgLinkChainAccount.fromPartial({
        chainAddress: Any.fromPartial({
          typeUrl: '/desmos.profiles.v3.Bech32Address',
          value: Bech32Address.encode(
            Bech32Address.fromPartial({
              value: externalAddress,
              prefix: selectedChain.prefix,
            }),
          ).finish(),
        }),
        proof,
        chainConfig: {
          name: selectedChain.name.toLowerCase(),
        },
        signer: activeAddr!,
      });

      const msg: MsgLinkChainAccountEncodeObject = {
        typeUrl: '/desmos.profiles.v3.MsgLinkChainAccount',
        value,
      };

      setMessage(msg);
    };

    generateMessage();
  }, []);

  const fee = React.useMemo(() => {
    if (!message) return undefined;

    const gas = messagesGas([message]);

    return computeTxFees(gas, EnvConfig.BASE_DENOM).average;
  }, [message]);

  const feeString = React.useMemo(() => {
    if (fee) {
      return formatFeeWithDenoms(fee).formattedString;
    }
  }, [fee]);

  const handlePressNext = React.useCallback(async () => {
    if (!chainAccount) return;
    const unlockResponse = await unlockWallet({ chainAccount });

    // handle case here
    if (!unlockResponse || !unlockResponse.wallet) return;

    const deserializedWallet = unlockResponse.wallet;

    navigate(ROUTES.BROADCAST_TX, {
      title: t('broadcastTx:connectChain') as string,
      messages: [message],
      offlineSigner: deserializedWallet!,
      successAction: () => {
        navigate(ROUTES.CONFIRM_MODAL, {
          image: modalSuccess,
          title: t('resultModal:success'),
          subtitle: t('resultModal:chainLinked', {
            chain: selectedChain.name.toUpperCase(),
          }),
          onPressPrimary: () => {
            navigate(ROUTES.BOTTOM_TABS, {
              screen: ROUTES.USER_PROFILE,
            });
          },
          primaryButtonLabel: t('resultModal:goToProfile') as string,
        });
      },
      failureAction: (errorMessage?: string) => {
        navigate(ROUTES.CONFIRM_MODAL, {
          image: errorImage,
          title: t('resultModal:failed'),
          subtitle: errorMessage,
          onPressPrimary: () => goBack(),
          primaryButtonLabel: t('common:retry') as string,
        });
      },
    });
  }, [chainAccount, message, fee, deserializedExternalWallet]);

  return (
    <DView style={styles.container} topBar={<TopBar />}>
      <Typography.H3>{t('header')}</Typography.H3>

      <View style={styles.chainImageGroup}>
        <Image source={desmosIcon} style={styles.chainIcon} />
        <Image source={connectIcon} style={styles.connectIcon} />
        <Image source={selectedChain.icon} style={styles.chainIcon} />
      </View>

      <Typography.Subtitle2 style={styles.textStyle}>{t('from')}</Typography.Subtitle2>
      <Typography.Body6 style={[styles.textStyle, styles.valueStyle]} numberOfLines={2}>
        {activeAddr}
      </Typography.Body6>

      <Typography.Subtitle2 style={styles.textStyle}>{t('connectTo')}</Typography.Subtitle2>
      <Typography.Body6 style={[styles.textStyle, styles.valueStyle]} numberOfLines={2}>
        {externalAddress}
      </Typography.Body6>

      <Typography.Subtitle2 style={styles.textStyle}>{t('fee')}</Typography.Subtitle2>
      <Typography.Body6 style={[styles.textStyle, styles.valueStyle]}>
        {feeString || <ActivityIndicator color={theme.colors.surfaceBlack} />}
      </Typography.Body6>

      {/* Aug 10 2022: note/memo is hidden as user never gets to enter a memo */}
      {/* <Typography.Subtitle2 style={styles.textStyle}> */}
      {/*  {t('note')} */}
      {/* </Typography.Subtitle2> */}
      {/* <Typography.Body6 style={[styles.textStyle, styles.valueStyle]}> */}
      {/*  {t('common:n/a')} */}
      {/* </Typography.Body6> */}

      <View style={styles.buttonContainer}>
        <Button
          color={theme.colors.surfaceBlack}
          disabled={!chainAccount || !message || !fee}
          mode="contained"
          onPress={handlePressNext}>
          {t('common:next')}
        </Button>
      </View>
    </DView>
  );
};

export default ConnectChainTxDetail;
