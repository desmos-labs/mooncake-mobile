import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {useTheme} from 'react-native-paper';
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
import HDDerivPathInputGroup from './components/HDDerivPathInputGroup';
import useStyles from '../useStyles';
import useGenerateAccountFromHDPath from './useGenerateAccountFromHDPath';

const DEBUG_MNEMONIC =
  'chef embody loan celery magnet replace refuse subway treat arena party purity lift estate afford shallow monitor vapor torch farm message kid cheap seed';

const DUMMY_COIN = 852;

const DUMMY_PREFIX = 'desmos';

type NavProps = StackScreenProps<
  RootNavigatorParamList,
  ROUTES.CONNECT_ADDRESS_GENERAL
>;

const ConnectAddressAdvanced = () => {
  // placeholder
  const {navigate} = useNavigation<NavProps['navigation']>();

  const {t} = useTranslation('connectAddress');

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
            navigate(ROUTES.CONNECT_ADDRESS_GENERAL);
          }}>
          {t('general')}
        </Typography.Button2>
      </View>
    );
  }, []);

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
        isNaN(parseInt(change)) ||
        isNaN(parseInt(account)) ||
        isNaN(parseInt(addressIndex))
      ) {
        setInvalidField(true);
        return;
      }

      generateAccountFromHDPath({
        mnemonic: DEBUG_MNEMONIC,
        coin: DUMMY_COIN,
        prefix: DUMMY_PREFIX,
        change: parseInt(change, 10),
        account: parseInt(account, 10),
        addressIndex: parseInt(addressIndex, 10),
      }).then(() => {
        setInvalidField(false);
      });
    },
    [],
  );

  return (
    <DView topBar={<TopBar rightElement={SwitchToGeneralButton} />}>
      <View style={styles.container}>
        <Typography.H5 style={styles.textStyle}>{t('header')}</Typography.H5>

        <Spacer paddingTop={theme.spacing.l} paddingBottom={theme.spacing.m}>
          <Typography.Body6 style={styles.textStyle}>
            {t('enterDerivPath')}
          </Typography.Body6>
        </Spacer>

        <Formik
          initialValues={initialFormValues}
          onSubmit={onFormSubmit}
          validate={onFormChange}>
          {({setFieldValue, values}) => {
            return (
              <View>
                <HDDerivPathInputGroup
                  coin={DUMMY_COIN}
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
          disabled={invalidField}>
          {t('common:next')}
        </Button>
      </View>
    </DView>
  );
};

export default ConnectAddressAdvanced;
