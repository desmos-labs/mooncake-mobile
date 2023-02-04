import BluetoothTransport from '@ledgerhq/react-native-hw-transport-ble';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {
  CompositeScreenProps,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {
  connectChainState,
  selectedExternalAccountState,
} from '@recoil/connectChainState';
import Button, {ButtonMode} from 'components/Button';
import DView from 'components/DView';
import HDDerivPathInputGroup from 'components/HDDerivPathInputGroup';
import Spacer from 'components/Spacer';
import TopBar from 'components/TopBar';
import Typography from 'components/Typography';
import {Formik, isNaN} from 'formik';
import useActiveAccount from 'hooks/useActiveAccount';
import useCheckIsAddressLinked from 'hooks/useCheckIsAddressLinked';
import useGenerateAccounts from 'hooks/useGenerateAccounts';
import useGenerateProof from 'hooks/useGenerateProof';
import {removeNonNumbers} from 'lib/FormatUtils';
import _ from 'lodash';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import {BottomTabsParamList} from 'navigation/RootNavigator/BottomTabs';
import ROUTES from 'navigation/routes';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import {IconButton, useTheme} from 'react-native-paper';
import {useRecoilValue, useSetRecoilState} from 'recoil';
import useStyles from '../useStyles';

export type NavProps = CompositeScreenProps<
  StackScreenProps<RootNavigatorParamList, ROUTES.CONNECT_ADDRESS_ADVANCED>,
  BottomTabScreenProps<BottomTabsParamList>
>;

export type ConnectAddressAdvancedParams = {
  nextRouteOverride?: keyof RootNavigatorParamList;
  loadedProfileMap?: Map<string, ProfileData>;
  titleLabelOverride?: string;

  ledgerTransport?: BluetoothTransport;
  ledgerApp?: LedgerApp;
};

const ConnectAddressAdvanced = () => {
  const {navigate, goBack} = useNavigation<NavProps['navigation']>();

  const {activeAddress} = useActiveAccount();
  const {generateProof} = useGenerateProof();

  const {t} = useTranslation('connectAddress');
  const route = useRoute<NavProps['route']>();
  const {nextRouteOverride, loadedProfileMap, titleLabelOverride} =
    route?.params ?? {};

  const setSelectedExternalAccount = useSetRecoilState(
    selectedExternalAccountState,
  );

  const styles = useStyles();

  const theme = useTheme();

  const [invalidField, setInvalidField] = React.useState(false);

  const {selectedChain} = useRecoilValue(connectChainState);

  const ledgerTransport = _.get(route, 'params.ledgerTransport');

  const {generateAccount, loading, accounts} = useGenerateAccounts();

  const {checkIsAddressLinked} = useCheckIsAddressLinked();

  const generatedAccount = accounts.length > 0 ? accounts[0] : undefined;

  const initialFormValues = React.useMemo(() => {
    return {
      account: '0',
      change: '0',
      addressIndex: '0',
    };
  }, []);

  // generate first account
  React.useEffect(() => {
    const {change, account, addressIndex} = initialFormValues;

    generateAccount({
      change: parseInt(change, 10),
      account: parseInt(account, 10),
      addressIndex: parseInt(addressIndex, 10),
    }).then();
  }, []);

  const SwitchToGeneralButton = React.useMemo(() => {
    return (
      <View style={styles.topBarButtonContainer}>
        <Button
          mode={ButtonMode.TEXT}
          size={26}
          textColor={theme.colors.butterOrange01}
          onPress={async () => {
            if (ledgerTransport) {
              await (ledgerTransport as BluetoothTransport).close();
            }

            navigate(ROUTES.CONNECT_ADDRESS_GENERAL, route.params);
          }}>
          {t('general')}
        </Button>
      </View>
    );
  }, [nextRouteOverride, loadedProfileMap, titleLabelOverride]);

  const handleSubmit = React.useCallback(async () => {
    if (!generatedAccount || !activeAddress) return;
    if (nextRouteOverride) {
      if (loadedProfileMap?.has(generatedAccount.address)) {
        return navigate(ROUTES.BOTTOM_TABS, {
          screen: ROUTES.USER_PROFILE,
        });
      }

      // TODO: refactor and fix
      // @ts-ignore
      return navigate(nextRouteOverride);
    }

    const proof = await generateProof({
      activeAddress,
      externalAccount: generatedAccount,
    });

    if (proof) {
      setSelectedExternalAccount(generatedAccount);
      navigate(ROUTES.CONNECT_CHAIN_TX_DETAIL, {
        proof,
        externalAddress: generatedAccount.address,
      });
    }
  }, [generatedAccount, activeAddress]);

  const onFormChange = React.useCallback(
    (formValues: typeof initialFormValues) => {
      const {change, account, addressIndex} = formValues;

      if (
        isNaN(parseInt(change, 10)) ||
        isNaN(parseInt(account, 10)) ||
        isNaN(parseInt(addressIndex, 10))
      ) {
        setInvalidField(true);
        return;
      }

      generateAccount({
        change: parseInt(change, 10),
        account: parseInt(account, 10),
        addressIndex: parseInt(addressIndex, 10),
      }).then(() => {
        setInvalidField(false);
      });
    },
    [],
  );

  const isAddressLinked = checkIsAddressLinked(generatedAccount?.address || '');

  const addressOrErrorElement = React.useMemo(() => {
    if (invalidField) return <View />;
    else if (generatedAccount && isAddressLinked) {
      return (
        <>
          <Typography.Body6>{generatedAccount.address}</Typography.Body6>
          <Typography.Body6 style={{marginTop: 8}}>
            {t('addrAlreadyLinked')}
          </Typography.Body6>
        </>
      );
    }
    return (
      <Typography.Body6>
        {loading || !generatedAccount
          ? t('generating')
          : generatedAccount.address}
      </Typography.Body6>
    );
  }, [generatedAccount, loading, invalidField, isAddressLinked]);

  return (
    <DView
      topBar={<TopBar rightElement={SwitchToGeneralButton} />}
      backgroundColor={theme.colors.white}>
      <View style={styles.container}>
        <Typography.H5 style={styles.textStyle}>
          {titleLabelOverride || t('header')}
        </Typography.H5>

        <Spacer paddingTop={theme.spacing.l} paddingBottom={theme.spacing.m}>
          <Typography.Body6 style={styles.textStyle}>
            {t('enterDerivPath')}
          </Typography.Body6>
        </Spacer>

        <View style={styles.tooltipGroup}>
          <Typography.Body6 style={styles.textStyle}>
            {t('hdDerivPath')}
          </Typography.Body6>
          <IconButton
            icon="information-outline"
            onPress={() => {
              navigate(ROUTES.CONFIRM_MODAL, {
                title: t('hdDerivPath'),
                subtitle: t('hdDerivPathModal'),
                primaryButtonLabel: t('common:ok'),
                onPressPrimary: () => goBack(),
              });
            }}
          />
        </View>

        <Formik
          onSubmit={() => {}}
          initialValues={initialFormValues}
          validate={onFormChange}>
          {({setFieldValue, values}) => {
            return (
              <View>
                <HDDerivPathInputGroup
                  coin={selectedChain.hdPath.coinType}
                  values={values}
                  handleChangeAccount={(value: string) => {
                    setFieldValue('account', removeNonNumbers(value));
                  }}
                  handleChangeChange={(value: string) =>
                    setFieldValue('change', removeNonNumbers(value))
                  }
                  handleChangeAddress={(value: string) =>
                    setFieldValue('addressIndex', removeNonNumbers(value))
                  }
                />

                <Spacer
                  paddingTop={theme.spacing.l}
                  paddingBottom={theme.spacing.m}>
                  <Typography.Subtitle2>{t('address')}</Typography.Subtitle2>
                </Spacer>

                <Spacer paddingBottom={theme.spacing.l}>
                  {addressOrErrorElement}
                </Spacer>

                <Button
                  size={44}
                  textColor={theme.colors.white}
                  backgroundColor={theme.colors.surfaceBlack}
                  mode={ButtonMode.CONTAINED}
                  loading={loading || !generatedAccount}
                  disabled={invalidField || isAddressLinked}
                  onPress={handleSubmit}>
                  {t('common:next')}
                </Button>
              </View>
            );
          }}
        </Formik>
      </View>
    </DView>
  );
};

export default ConnectAddressAdvanced;
