import React, {FC} from 'react';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {IconButton, useTheme} from 'react-native-paper';
import DView from 'components/DView';
import TopBar from 'components/TopBar';
import {View} from 'react-native';
import Typography from 'components/Typography';
import Spacer from 'components/Spacer';
import {StackScreenProps} from '@react-navigation/stack';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import {Formik, isNaN} from 'formik';
import Button from 'components/Button';
import {removeNonNumbers} from 'lib/FormatUtils';
import {useRecoilValue, useSetRecoilState} from 'recoil';
import {
  connectChainState,
  selectedExternalAccountState,
} from '@recoil/connectChainState';
import HDDerivPathInputGroup from './components/HDDerivPathInputGroup';
import useStyles from '../useStyles';
import useGenerateAccountFromHDPath from './useGenerateAccountFromHDPath';

type NavProps = StackScreenProps<
  RootNavigatorParamList,
  ROUTES.CONNECT_ADDRESS_GENERAL
>;

// https://reactnavigation.org/docs/troubleshooting/#i-get-the-warning-non-serializable-values-were-found-in-the-navigation-state
export type ConnectAddressAdvancedParams = {
  nextRouteOverride?: keyof RootNavigatorParamList;
  loadedProfileAddresses?: Set<string>;
};

const ConnectAddressAdvanced: FC<NavProps> = ({route}) => {
  const {nextRouteOverride, loadedProfileAddresses} = route?.params ?? {};
  const {navigate, goBack} = useNavigation<NavProps['navigation']>();

  const {t} = useTranslation('connectAddress');

  const {mnemonic, selectedChain} = useRecoilValue(connectChainState);

  const setSelectedExternalAccount = useSetRecoilState(
    selectedExternalAccountState,
  );

  const styles = useStyles();

  const theme = useTheme();

  const [invalidField, setInvalidField] = React.useState(false);

  const {generateAccountFromHDPath, generating, generatedAccount} =
    useGenerateAccountFromHDPath();

  const SwitchToGeneralButton = React.useMemo(() => {
    return (
      <View style={styles.topBarButtonContainer}>
        <Typography.Button2
          style={styles.modeButtonText}
          onPress={() => {
            navigate(ROUTES.CONNECT_ADDRESS_GENERAL, {
              nextRouteOverride,
              loadedProfileAddresses,
            });
          }}>
          {t('general')}
        </Typography.Button2>
      </View>
    );
  }, [nextRouteOverride, loadedProfileAddresses]);

  const initialFormValues = React.useMemo(() => {
    return {
      account: '0',
      change: '0',
      addressIndex: '0',
    };
  }, []);

  const onFormSubmit = React.useCallback(
    (formValues: typeof initialFormValues) => {
      console.log(formValues);
    },
    [],
  );

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

      generateAccountFromHDPath({
        mnemonic,
        coin: selectedChain.hdPath.coinType,
        prefix: selectedChain.prefix,
        change: parseInt(change, 10),
        account: parseInt(account, 10),
        addressIndex: parseInt(addressIndex, 10),
      }).then(() => {
        setInvalidField(false);
      });
    },
    [],
  );

  const handlePressConfirm = React.useCallback(() => {
    if (!generatedAccount) return;

    if (nextRouteOverride) {
      if (loadedProfileAddresses?.has(generatedAccount.bech32Address)) {
        return navigate(ROUTES.USER_PROFILE, {
          visitingProfileAddress: generatedAccount.bech32Address,
        });
      }

      return navigate(nextRouteOverride);
    }

    setSelectedExternalAccount(generatedAccount.serialize);
    navigate(ROUTES.CONNECT_CHAIN_TX_DETAIL);
  }, [nextRouteOverride, generatedAccount]);

  return (
    <DView topBar={<TopBar rightElement={SwitchToGeneralButton} />}>
      <View style={styles.container}>
        <Typography.H5 style={styles.textStyle}>{t('header')}</Typography.H5>

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
          initialValues={initialFormValues}
          onSubmit={onFormSubmit}
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
              </View>
            );
          }}
        </Formik>

        <Spacer paddingTop={theme.spacing.l} paddingBottom={theme.spacing.m}>
          <Typography.Subtitle2>{t('address')}</Typography.Subtitle2>
        </Spacer>

        <Spacer paddingBottom={theme.spacing.l}>
          {invalidField ? (
            <Typography.Body6>Invalid field</Typography.Body6>
          ) : (
            <Typography.Body6>
              {generating || !generatedAccount
                ? t('generating')
                : generatedAccount.bech32Address}
            </Typography.Body6>
          )}
        </Spacer>

        <Button
          mode="gradientFilled"
          loading={generating || !generatedAccount}
          disabled={invalidField}
          onPress={handlePressConfirm}>
          {t('common:next')}
        </Button>
      </View>
    </DView>
  );
};

export default ConnectAddressAdvanced;
