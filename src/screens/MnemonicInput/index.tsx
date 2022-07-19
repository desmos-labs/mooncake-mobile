import React from 'react';
import DView from 'components/DView';
import Typography from 'components/Typography';
import {StackScreenProps} from '@react-navigation/stack';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import {Trans, useTranslation} from 'react-i18next';
import DTextInput from 'components/DTextInput';
import Button from 'components/Button';
import {Formik} from 'formik';
import {KeyboardAvoidingView, Platform, View} from 'react-native';
import CustomCheckbox from 'components/CustomCheckbox';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useRoute} from '@react-navigation/native';
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
    <DView style={styles.container}>
      <Typography.H3>{t(headerText)}</Typography.H3>
      <Typography.Body6 style={styles.descriptionText}>
        {t('description')}
      </Typography.Body6>

      <Formik
        initialValues={initialFormFields}
        validate={validateForm}
        validateOnChange={false}
        onSubmit={onSubmit}>
        {({handleSubmit, errors, values, setFieldValue, resetForm}) => (
          <View style={styles.formContainer}>
            <Typography.Subtitle2 style={styles.inputLabel}>
              {t('inputLabel')}
            </Typography.Subtitle2>

            <DTextInput
              multiline
              error={!!errors.mnemonic}
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

            <KeyboardAvoidingView
              keyboardVerticalOffset={Platform.OS === 'ios' ? top + 180 : 0}
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
              style={styles.buttonGroup}>
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

              <Button
                mode="gradientFilled"
                labelStyle={styles.labelStyle}
                onPress={handleSubmit}>
                {t(buttonText)}
              </Button>
            </KeyboardAvoidingView>
          </View>
        )}
      </Formik>
    </DView>
  );
};

export default MnemonicInput;
