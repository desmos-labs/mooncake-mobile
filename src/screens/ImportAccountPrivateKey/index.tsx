import Typography from '@desmoslabs/desmos-kit-ui/components/Typography';
import Button from 'components/Button';
import DTextInput from 'components/DTextInput';
import DView from 'components/DView';
import Spacer from 'components/Spacer';
import TopBar from 'components/TopBar';
import CommonStyles from 'config/theme/CommonStyles';
import { Formik } from 'formik';
import { useTheme } from 'native-base';
import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import useHooks from './useHooks';
import useStyles from './useStyles';

/**
 * Screen that allows the user to import their wallet by inputting the private key.
 * @constructor
 */
const ImportAccountPrivateKey = () => {
  const theme = useTheme();
  const styles = useStyles();

  // -------------------------------------------------------------------------------------
  // --- Hooks
  // -------------------------------------------------------------------------------------

  const { handleFormSubmit, initialFormValues, loginLoading } = useHooks();

  // -------------------------------------------------------------------------------------
  // --- Screen rendering
  // -------------------------------------------------------------------------------------

  return (
    <DView style={styles.container} topBar={<TopBar />}>
      <Typography.H3 style={styles.headerText}>Import Private Key</Typography.H3>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={CommonStyles.flex['1']}>
        <Formik
          initialValues={initialFormValues}
          validateOnChange={false}
          onSubmit={handleFormSubmit}>
          {({ handleSubmit, errors, values, setFieldValue }) => (
            <>
              <ScrollView
                contentInsetAdjustmentBehavior="automatic"
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="on-drag">
                <View style={styles.labelGroup}>
                  <Typography.Regular14>
                    Please enter your private key here to restore your account
                  </Typography.Regular14>
                </View>
                <Spacer paddingTop="m" />
                <Typography.Semibold14>Private Key</Typography.Semibold14>
                <Spacer paddingBottom="s" />
                <DTextInput
                  autoCapitalize="none"
                  textAlignVertical="top"
                  multiline
                  scrollEnabled={false}
                  error={!!errors.privateKey}
                  placeholder="Enter your private key"
                  value={values.privateKey}
                  style={styles.mnemonicInput}
                  inputStyle={styles.mnemonicInputLabel}
                  onChangeText={text => {
                    setFieldValue('privateKey', text, false);
                  }}
                />
              </ScrollView>
              <Button
                size={44}
                backgroundColor={theme.colors.surfaceBlack}
                textColor={theme.colors.white}
                onPress={() => handleSubmit()}
                style={styles.confirmButton}
                isLoading={loginLoading}
                disabled={values.privateKey === '' || loginLoading}>
                Next
              </Button>
            </>
          )}
        </Formik>
      </KeyboardAvoidingView>
    </DView>
  );
};

export default ImportAccountPrivateKey;
