import {useRoute} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import Button from 'components/Button';
import CustomCheckbox from 'components/CustomCheckbox';
import DTextInput from 'components/DTextInput';
import DView from 'components/DView';
import TopBar from 'components/TopBar';
import Typography from 'components/Typography';
import EnvConfig from 'config/EnvConfig';
import {Formik} from 'formik';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React from 'react';
import {Trans, useTranslation} from 'react-i18next';
import {KeyboardAvoidingView, Platform, ScrollView, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import useHooks from './useHooks';
import useStyles from './useStyles';

export enum MNEMONIC_INPUT_MODE {
  RESET_PASSWORD,
  IMPORT_RECOVERY_PHRASE,
}

export type MnemonicInputParams = {
  mode: MNEMONIC_INPUT_MODE;
};
export type NavProps = StackScreenProps<
  RootNavigatorParamList,
  ROUTES.MNEMONIC_INPUT
>;

const MnemonicInput = () => {
  const {
    params: {mode},
  } = useRoute<NavProps['route']>();

  const styles = useStyles();
  const theme = useTheme();
  const {top} = useSafeAreaInsets();
  const {t} = useTranslation('mnemonicInput');

  const {
    headerText,
    buttonText,
    handlePressPP,
    handlePressTOS,
    onSubmit,
    validateForm,
    initialFormFields,
  } = useHooks();

  return (
    <DView style={styles.container} topBar={<TopBar />}>
      <Typography.H3>{t(headerText)}</Typography.H3>
      <KeyboardAvoidingView
        keyboardVerticalOffset={Platform.OS === 'ios' ? top + 50 : 0}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{flex: 1}}>
        <Formik
          initialValues={initialFormFields}
          validate={validateForm}
          validateOnChange={false}
          onSubmit={onSubmit}>
          {({handleSubmit, errors, values, setFieldValue, resetForm}) => (
            <>
              <ScrollView keyboardDismissMode="on-drag">
                <View style={{flex: 1}}>
                  <Typography.Body6 style={styles.descriptionText}>
                    {t('description')}
                  </Typography.Body6>
                  <Typography.Subtitle2 style={styles.inputLabel}>
                    {t('inputLabel')}
                  </Typography.Subtitle2>

                  <DTextInput
                    autoCapitalize="none"
                    textAlignVertical="top"
                    multiline
                    scrollEnabled={false}
                    error={!!errors.mnemonic}
                    inputStyle={styles.mnemonicInputLabel}
                    style={[
                      styles.mnemonicInput,
                      errors.mnemonic ? styles.errorInput : undefined,
                    ]}
                    placeholder={t('inputPlaceholder')}
                    value={values.mnemonic}
                    onChangeText={text => {
                      setFieldValue('mnemonic', text, false);
                    }}
                  />

                  {errors.mnemonic && (
                    <View style={styles.errorGroup}>
                      <Typography.Caption1 style={styles.errorText}>
                        {errors.mnemonic}
                      </Typography.Caption1>

                      <Typography.Subtitle4
                        onPress={() => {
                          resetForm({values: initialFormFields});
                        }}
                        style={styles.clearAllText}>
                        {t('clearAll')}
                      </Typography.Subtitle4>
                    </View>
                  )}
                </View>
              </ScrollView>

              {mode === MNEMONIC_INPUT_MODE.IMPORT_RECOVERY_PHRASE && (
                <View style={styles.consentGroup}>
                  <CustomCheckbox
                    checked={values.consent}
                    handlePress={() =>
                      setFieldValue('consent', !values.consent, false)
                    }
                    error={!!errors.consent}
                  />

                  <Typography.Body6 style={styles.consentText}>
                    <Trans
                      i18nKey="mnemonicInput:userConsent"
                      components={[
                        <Typography.Body6
                          onPress={handlePressTOS}
                          style={styles.touchableText}
                        />,
                        <Typography.Body6
                          onPress={handlePressPP}
                          style={styles.touchableText}
                        />,
                      ]}
                    />
                  </Typography.Body6>
                </View>
              )}
              <View style={{backgroundColor: theme.colors.background}}>
                {__DEV__ && (
                  <Button
                    mode="text"
                    size={32}
                    onPress={() =>
                      setFieldValue('mnemonic', EnvConfig.DEV_MNEMONIC, false)
                    }>
                    autofill mnemonic
                  </Button>
                )}
                <Button
                  backgroundColor={theme.colors.surfaceBlack}
                  textColor={theme.colors.white}
                  mode="contained"
                  size={44}
                  onPress={() => handleSubmit()}>
                  {t(buttonText)}
                </Button>
              </View>
            </>
          )}
        </Formik>
      </KeyboardAvoidingView>
    </DView>
  );
};

export default MnemonicInput;
