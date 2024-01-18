import { NativeStackScreenProps } from '@react-navigation/native-stack';
import DView from 'components/DView';
import TopBar from 'components/TopBar';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import Typography from '@desmoslabs/desmos-kit-ui/components/Typography';
import Spacer from 'components/Spacer';
import DSecureTextInput from 'components/DSecureTextInput';
import Button from 'components/Button';
import { Center, useTheme } from 'native-base';
import useUnlockWalletWithPassword from 'hooks/wallet/useUnlockWalletWithPassword';
import { useActiveAccountAddress } from '@recoil/accounts';
import { WalletWithPrivateKey } from 'types/wallet';
import { toHex } from '@cosmjs/encoding';
import Clipboard from '@react-native-clipboard/clipboard';
import useToast from 'hooks/toasts/useToast';
import { ToastType } from 'config/toast/toastConfig';
import { Formik, FormikHelpers } from 'formik';
import useClearUserData from 'hooks/useClearUserData';
import useStyles from './useStyles';

type NavProps = NativeStackScreenProps<RootNavigatorParamList, ROUTES.REVEAL_PRIVATE_KEY>;

const RevealPrivateKey: React.FC<NavProps> = () => {
  const { t } = useTranslation('settings');
  const theme = useTheme();
  const styles = useStyles();

  // -------------------------------------------------------------------------------------
  // --- States
  // -------------------------------------------------------------------------------------

  const [privateKey, setPrivateKey] = React.useState<string>();
  const initialFormValues = React.useMemo(
    () => ({
      password: '',
    }),
    [],
  );

  // -------------------------------------------------------------------------------------
  // --- Hooks
  // -------------------------------------------------------------------------------------

  const showToast = useToast();
  const activeAccountAddress = useActiveAccountAddress();
  const unlockWalletWithPassword = useUnlockWalletWithPassword();
  const clearUserData = useClearUserData();

  // -------------------------------------------------------------------------------------
  // --- Actions
  // -------------------------------------------------------------------------------------

  const onFormSubmit = React.useCallback(
    async (values: typeof initialFormValues, helpers: FormikHelpers<typeof initialFormValues>) => {
      if (!activeAccountAddress) {
        return;
      }

      const { password } = values;
      const unlockWalletResult = await unlockWalletWithPassword(activeAccountAddress, password);
      if (unlockWalletResult.isOk()) {
        const privateKeyBytes = (unlockWalletResult.value as WalletWithPrivateKey).privateKey;
        setPrivateKey(toHex(privateKeyBytes));
      } else {
        helpers.setErrors({
          password: t('incorrect password', { ns: 'password' }),
        });
      }
    },
    [activeAccountAddress, t, unlockWalletWithPassword],
  );

  const copyPrivateKey = React.useCallback(() => {
    if (privateKey) {
      Clipboard.setString(privateKey);
      showToast({
        toastType: ToastType.info,
        message: t('private key copied'),
      });
    }
  }, [privateKey, showToast, t]);

  // -------------------------------------------------------------------------------------
  // --- Screen rendering
  // -------------------------------------------------------------------------------------

  return (
    <DView
      style={styles.root}
      topBar={
        <TopBar
          centerElement={
            <Typography.Semibold16>
              {privateKey ? t('private key') : t('reveal private key')}
            </Typography.Semibold16>
          }
        />
      }>
      <Spacer paddingTop="m" />
      <View style={styles.warningContainer}>
        <Typography.Semibold14 style={styles.warningText}>
          {t('never disclose this key')}
        </Typography.Semibold14>
        <Typography.Regular14 style={styles.warningText}>
          {t('never disclose this key explanation')}
        </Typography.Regular14>
      </View>
      <Spacer paddingTop="l" />

      {privateKey === undefined ? (
        <>
          <Formik onSubmit={onFormSubmit} initialValues={initialFormValues}>
            {({ handleSubmit, values, errors, setFieldValue, setErrors }) => {
              return (
                <>
                  <Typography.Regular16>{t('password', { ns: 'password' })}</Typography.Regular16>
                  <Spacer paddingTop="s" />
                  <DSecureTextInput
                    value={values.password}
                    style={styles.passwordInput}
                    placeholder={t('enter password', { ns: 'password' })}
                    onChangeText={text => {
                      setErrors({});
                      setFieldValue('password', text, true);
                    }}
                    onSubmitEditing={() => handleSubmit()}
                  />
                  {errors.password !== undefined && (
                    <Typography.Regular14 style={styles.wrongPasswordError}>
                      {errors.password as string}
                    </Typography.Regular14>
                  )}
                  <Spacer paddingTop={40} />
                  <Button
                    size={44}
                    backgroundColor={theme.colors.neutral['900']}
                    textColor={theme.colors.white}
                    onPress={handleSubmit}>
                    {t('confirm', { ns: 'common' })}
                  </Button>
                </>
              );
            }}
          </Formik>
          <Spacer paddingTop="m" />
          <TouchableOpacity onPress={clearUserData}>
            <Center>
              <Typography.Regular14>
                {t('forgot password', { ns: 'password' })}
              </Typography.Regular14>
            </Center>
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity onPress={copyPrivateKey}>
          <View style={styles.privateKeyView}>
            <Typography.Regular14>{privateKey}</Typography.Regular14>
          </View>
        </TouchableOpacity>
      )}
    </DView>
  );
};

export default RevealPrivateKey;
