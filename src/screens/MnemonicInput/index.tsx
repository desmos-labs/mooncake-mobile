import Button, { ButtonMode } from 'components/Button';
import DTextInput from 'components/DTextInput';
import DView from 'components/DView';
import TopBar from 'components/TopBar';
import Typography from 'components/Typography';
import EnvConfig from 'config/EnvConfig';
import { Formik } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useInitialFormFields, useOnSubmit, useValidateForm } from './hooks';
import useStyles from './useStyles';

/**
 * Screen that allows the user to input their account mnemonic phrase.
 * @constructor
 */
const MnemonicInput = () => {
  const styles = useStyles();
  const theme = useTheme();
  const { top } = useSafeAreaInsets();
  const { t } = useTranslation('mnemonicInput');

  const initialFormFields = useInitialFormFields();
  const validateForm = useValidateForm();
  const onSubmit = useOnSubmit();

  return (
    <DView style={styles.container} backgroundColor={theme.colors.white} topBar={<TopBar />}>
      <Typography.H3>{t('importMnemonic')}</Typography.H3>
      <KeyboardAvoidingView
        keyboardVerticalOffset={Platform.OS === 'ios' ? top + 50 : 0}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}>
        <Formik
          initialValues={initialFormFields}
          validate={validateForm}
          validateOnChange={false}
          onSubmit={onSubmit}>
          {({ handleSubmit, errors, values, setFieldValue, resetForm }) => (
            <>
              <ScrollView keyboardDismissMode="on-drag">
                <View style={{ flex: 1 }}>
                  <Typography.Body6 style={styles.descriptionText}>
                    {t('description')}
                  </Typography.Body6>
                  <Typography.Subtitle2 style={styles.inputLabel}>
                    {t('inputLabel')}
                  </Typography.Subtitle2>

                  <DTextInput
                    testID="mnemonicInput"
                    autoCapitalize="none"
                    textAlignVertical="top"
                    multiline
                    scrollEnabled={false}
                    error={!!errors.mnemonic}
                    inputStyle={styles.mnemonicInputLabel}
                    style={[styles.mnemonicInput, errors.mnemonic ? styles.errorInput : undefined]}
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
                          resetForm({ values: initialFormFields });
                        }}
                        style={styles.clearAllText}>
                        {t('clearAll')}
                      </Typography.Subtitle4>
                    </View>
                  )}
                </View>
              </ScrollView>

              <View>
                {__DEV__ && (
                  <Button
                    mode={ButtonMode.TEXT}
                    size={32}
                    onPress={() => setFieldValue('mnemonic', EnvConfig.DEV_MNEMONIC, false)}>
                    Autofill mnemonic
                  </Button>
                )}
                <Button
                  backgroundColor={theme.colors.surfaceBlack}
                  textColor={theme.colors.white}
                  mode={ButtonMode.CONTAINED}
                  size={44}
                  onPress={() => handleSubmit()}>
                  {t('common:confirm')}
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
