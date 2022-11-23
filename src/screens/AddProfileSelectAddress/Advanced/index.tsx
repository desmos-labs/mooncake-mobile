import {toBase64} from '@cosmjs/encoding';
import {useNavigation, useRoute} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import createLocalWalletState from '@recoil/createLocalWalletState';
import walletAndAccountToAddState from '@recoil/walletAndAccountToAddState';
import Button from 'components/Button';
import DView from 'components/DView';
import Spacer from 'components/Spacer';
import TopBar from 'components/TopBar';
import Typography from 'components/Typography';
import {Formik, isNaN} from 'formik';
import useActiveAccount from 'hooks/useActiveAccount';
import {removeNonNumbers} from 'lib/FormatUtils';
import LocalWallet from 'lib/LocalWallet';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import {IconButton, useTheme} from 'react-native-paper';
import {useSetRecoilState} from 'recoil';
import {ChainAccount, ChainAccountType} from 'types/chains';
import {DESMOS_COIN_TYPE} from 'types/hdpath';
import useHooks from '../useHooks';
import useStyles from '../useStyles';
import HDDerivPathInputGroup from './components/HDDerivPathInputGroup';

export type NavProps = StackScreenProps<
  RootNavigatorParamList,
  ROUTES.ADD_PROFILE_SELECT_ADDRESS_ADVANCED
>;

export type AddProfileSelectAddressAdvancedParams = {
  mnemonic?: string;
  password?: string;
};

const AddProfileSelectAddressAdvanced = () => {
  const {navigate, goBack} = useNavigation<NavProps['navigation']>();
  const {activeAddress} = useActiveAccount();
  const {t} = useTranslation('connectAddress');
  const {
    params: {mnemonic, password},
  } = useRoute<NavProps['route']>();
  const styles = useStyles();
  const theme = useTheme();
  const {generateAccount} = useHooks();
  const [invalidField, setInvalidField] = useState(false);
  const [generatedAccount, setGeneratedAccount] = useState<any>();
  const [loading, setLoading] = useState(true);
  const setAccountCreation = useSetRecoilState(createLocalWalletState);
  const setWalletAndAccountToAdd = useSetRecoilState(
    walletAndAccountToAddState,
  );

  const initialFormValues = React.useMemo(() => {
    return {
      account: '0',
      change: '0',
      addressIndex: '0',
    };
  }, []);

  const generateAccountFromParams = useCallback(
    async ({
      change,
      account,
      addressIndex,
    }: {
      change: string;
      account: string;
      addressIndex: string;
    }) => {
      try {
        setLoading(true);
        const generatedAcc = await generateAccount(
          parseInt(change, 10),
          parseInt(account, 10),
          parseInt(addressIndex, 10),
          mnemonic,
        );
        if (account) {
          setGeneratedAccount(generatedAcc);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    },
    [generateAccount, generatedAccount],
  );

  // generate first account
  React.useEffect(() => {
    const {change, account, addressIndex} = initialFormValues;
    generateAccountFromParams({change, account, addressIndex});
  }, []);

  const SwitchToGeneralButton = React.useMemo(() => {
    return (
      <View style={styles.topBarButtonContainer}>
        <Button
          mode="text"
          onPress={async () => {
            navigate(ROUTES.ADD_PROFILE_SELECT_ADDRESS_GENERAL, {mnemonic});
          }}>
          <Typography.Button2 style={styles.modeButtonText}>
            {t('general')}
          </Typography.Button2>
        </Button>
      </View>
    );
  }, []);

  const handleSubmit = React.useCallback(async () => {
    if (!generatedAccount || !activeAddress) return;
    const deserializedWallet = await LocalWallet.deserialize(
      generatedAccount.signer as string,
    );
    const chainAccount: ChainAccount = {
      address: deserializedWallet.bech32Address,
      type: ChainAccountType.Local,
      pubKey: toBase64(deserializedWallet.publicKey),
      hdPath: generatedAccount.hdPath,
      signAlgorithm: 'secp256k1',
    };
    setWalletAndAccountToAdd({
      accountWithWalletData: {
        chainAccount,
        wallet: generatedAccount.signer as string,
      },
      password: password!,
      mnemonic: mnemonic!,
    });
    setAccountCreation({
      source: ROUTES.ADD_PROFILE_SELECT_ADDRESS_ADVANCED,
    });
    navigate(ROUTES.CREATE_DESMOS_PROFILE);
  }, []);

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

      generateAccountFromParams({
        change,
        account,
        addressIndex,
      }).then(() => {
        setInvalidField(false);
      });
    },
    [],
  );

  const isProfileAlreadyAdded = useMemo(
    () => generatedAccount?.address === activeAddress,
    [generatedAccount],
  );

  useEffect(() => {
    return () => {
      console.log(generatedAccount);
    };
  }, [generatedAccount]);

  const addressOrErrorElement = React.useMemo(() => {
    if (invalidField) return <View />;
    else if (generatedAccount && isProfileAlreadyAdded) {
      return (
        <>
          <Typography.Body6>{generatedAccount.address}</Typography.Body6>
          <Typography.Body6 style={{marginTop: 8}}>
            {t('alreadyAdded')}
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
  }, [generatedAccount, loading, invalidField, isProfileAlreadyAdded]);

  return (
    <DView
      topBar={<TopBar rightElement={SwitchToGeneralButton} />}
      backgroundColor={theme.colors.white}>
      <View style={styles.container}>
        <Typography.H3 style={styles.textStyle}>
          {t('addProfile:title')}
        </Typography.H3>

        <Spacer paddingTop={theme.spacing.l} paddingBottom={theme.spacing.m}>
          <Typography.Body6 style={styles.textStyle}>
            {t('enterDerivPath')}
          </Typography.Body6>
        </Spacer>

        <View style={styles.tooltipGroup}>
          <Typography.Subtitle2 style={styles.textStyle}>
            {t('hdDerivPath')}
          </Typography.Subtitle2>
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
                  coin={DESMOS_COIN_TYPE}
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
                  color={theme.colors.surfaceBlack}
                  mode="contained"
                  loading={loading || !generatedAccount}
                  disabled={invalidField || isProfileAlreadyAdded}
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

export default AddProfileSelectAddressAdvanced;
