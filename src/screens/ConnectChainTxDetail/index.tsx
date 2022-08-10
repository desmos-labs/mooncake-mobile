import React from 'react';
import DView from 'components/DView';
import TopBar from 'components/TopBar';
import Typography from 'components/Typography';
import {useTranslation} from 'react-i18next';
import {ActivityIndicator, Image, View} from 'react-native';
import {connectIcon, desmosIcon} from 'assets/images';
import Button from 'components/Button';
import {StackScreenProps} from '@react-navigation/stack';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import {useNavigation} from '@react-navigation/native';
import {useRecoilValue} from 'recoil';
import {connectChainState} from '@recoil/connectChainState';
import {getMMKV, MMKVKEYS} from 'lib/MMKVStorage';
import {MsgLinkChainAccount} from '@desmoslabs/desmjs-types/desmos/profiles/v3/msgs_chain_links';
import {generateProof} from 'lib/desmos/chainlink';
import LocalWallet from 'lib/LocalWallet';
import {computeTxFees, messagesGas} from 'lib/desmos/fees';
import {formatFeeWithDenoms} from 'lib/FormatUtils';
import useUnlockWallet from 'hooks/useUnlockWallet';
import useActiveAccount from 'hooks/useActiveAccount';
import MsgTypes from 'lib/desmos/msgtypes';
import useStyles from './useStyles';

type NavProps = StackScreenProps<
  RootNavigatorParamList,
  ROUTES.CONNECT_CHAIN_TX_DETAIL
>;

const ConnectChainTxDetail = () => {
  const {t} = useTranslation('connectChainTxDetail');

  const {navigate, goBack} = useNavigation<NavProps['navigation']>();

  const {chainAccount} = useActiveAccount();

  const unlockWallet = useUnlockWallet();

  const {selectedChain, selectedExternalAccount} =
    useRecoilValue(connectChainState);

  const activeAddr = getMMKV(MMKVKEYS.ACTIVE_ACCOUNT_ADDR);

  const styles = useStyles();

  const [message, setMessage] = React.useState<any>(undefined);
  const [deserializedWallet, setDeserializedWallet] = React.useState<
    LocalWallet | undefined
  >(undefined);

  React.useEffect(() => {
    const generateMessage = async () => {
      if (!selectedChain) return;

      const externalWallet = await LocalWallet.deserialize(
        selectedExternalAccount,
      );

      const proof = await generateProof({
        signerAddress: externalWallet.bech32Address,
        externalChainWallet: externalWallet,
        chain: selectedChain,
      });

      setDeserializedWallet(externalWallet);

      setMessage({
        typeUrl: MsgTypes.MsgLinkChainAccount,
        value: MsgLinkChainAccount.fromPartial({
          signer: activeAddr,
          ...proof,
        }),
      });
    };

    generateMessage();
  }, []);

  const fee = React.useMemo(() => {
    if (!message) return undefined;

    const gas = messagesGas([message]);

    return computeTxFees(gas, 'udaric').average;
  }, [message]);

  const feeString = React.useMemo(() => {
    if (fee) {
      return formatFeeWithDenoms(fee).formattedString;
    }
  }, [fee]);

  const handlePressNext = React.useCallback(async () => {
    const unlockResponse = await unlockWallet(chainAccount!);

    // handle case here
    if (!unlockResponse) return;

    console.log(unlockResponse);

    navigate(ROUTES.BROADCAST_TX, {
      messages: [message],
      offlineSigner: unlockResponse.signer!,
      successAction: () => {
        console.log('chain linked');
      },
      failureAction: () => {
        goBack();
      },
    });
  }, [chainAccount, message, fee, deserializedWallet]);

  return (
    <DView scrollable style={styles.container} topBar={<TopBar />}>
      <Typography.H3>{t('header')}</Typography.H3>

      <View style={styles.chainImageGroup}>
        <Image source={desmosIcon} style={styles.chainIcon} />
        <Image source={connectIcon} style={styles.connectIcon} />
        <Image source={selectedChain.icon} style={styles.chainIcon} />
      </View>

      <Typography.Subtitle2 style={styles.textStyle}>
        {t('from')}
      </Typography.Subtitle2>
      <Typography.Body6 style={[styles.textStyle, styles.valueStyle]}>
        {activeAddr}
      </Typography.Body6>

      <Typography.Subtitle2 style={styles.textStyle}>
        {t('connectTo')}
      </Typography.Subtitle2>
      <Typography.Body6 style={[styles.textStyle, styles.valueStyle]}>
        {deserializedWallet ? (
          deserializedWallet.bech32Address
        ) : (
          <ActivityIndicator />
        )}
      </Typography.Body6>

      <Typography.Subtitle2 style={styles.textStyle}>
        {t('fee')}
      </Typography.Subtitle2>
      <Typography.Body6 style={[styles.textStyle, styles.valueStyle]}>
        {feeString || <ActivityIndicator />}
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
          disabled={!chainAccount || !message || !fee || !deserializedWallet}
          mode="gradientFilled"
          onPress={handlePressNext}>
          {t('common:next')}
        </Button>
      </View>
    </DView>
  );
};

export default ConnectChainTxDetail;
