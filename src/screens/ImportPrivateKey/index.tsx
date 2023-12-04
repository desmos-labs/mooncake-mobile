import Button from 'components/Button';
import DTextInput from 'components/DTextInput';
import DView from 'components/DView';
import Spacer from 'components/Spacer';
import TopBar from 'components/TopBar';
import Typography from 'components/Typography';
import CommonStyles from 'config/theme/CommonStyles';
import { Formik } from 'formik';
import { useTheme } from 'native-base';
import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import useHooks from './useHooks';
import useStyles from './useStyles';

const ImportPrivateKey = () => {
  const styles = useStyles();
  const theme = useTheme();

  const { handleFormSubmit, initialFormValues, loginLoading } = useHooks();

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
                  <Typography.Body6>
                    Please enter your private key here to restore your account
                  </Typography.Body6>
                </View>
                <Spacer paddingTop="m" />
                <Typography.Subtitle2>Private Key</Typography.Subtitle2>
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

export default ImportPrivateKey;
