import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps, useRoute } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import Button from 'components/Button';
import DSecureTextInput from 'components/DSecureTextInput';
import DView from 'components/DView';
import PasswordChecksGroup from 'components/PasswordChecksGroup';
import Spacer from 'components/Spacer';
import StyledSpinner from 'components/StyledSpinner';
import TopBar from 'components/TopBar';
import Typography from 'components/Typography';
import CommonStyles from 'config/theme/CommonStyles';
import { Formik } from 'formik';
import _ from 'lodash';
import { Box, useTheme } from 'native-base';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import { BottomTabsParamList } from 'navigation/RootNavigator/BottomTabs';
import ROUTES from 'navigation/routes';
import React, { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Platform, ScrollView, TextInput, View } from 'react-native';
import PasswordChecker from 'screens/PasswordManipulation/components/PasswordChecker';
import { AccountWithWallet } from 'types/account';
import { DesmosProfile } from 'types/desmos';
import * as Yup from 'yup';
import zxcvbn from 'zxcvbn';
import useHooks, { PASSWORD_MANIPULATION_MODE } from './useHooks';
import useStyles from './useStyles';

export type PasswordManipulationParams = {
  /**
   * Mode of the password manipulation.
   */
  mode: PASSWORD_MANIPULATION_MODE;

  /**
   * Account that need to be saved.
   */
  account?: AccountWithWallet;

  /**
   * Profile that need to be saved.
   */
  profile?: DesmosProfile;

  /**
   * Old password passed from origin screen.
   */
  oldPassword?: string;
};

export type NavProps = CompositeScreenProps<
  StackScreenProps<RootNavigatorParamList, ROUTES.PASSWORD_MANIPULATION>,
  BottomTabScreenProps<BottomTabsParamList, ROUTES.PROFILE>
>;

const PasswordManipulation = () => {
  const { t } = useTranslation('password');
  const styles = useStyles();
  const theme = useTheme();
  const scrollViewRef = useRef<ScrollView>(null);
  const confirmPasswordRef = useRef<TextInput>(null);
  const {
    params: { mode },
  } = useRoute<NavProps['route']>();
  const [isUserTyping, setIsUserTyping] = useState(false);
  const timeout = useRef<any>(null);

  const debounceTyping = useCallback(() => {
    setIsUserTyping(true);
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      setIsUserTyping(false);
    }, 500);
  }, []);

  const validationSchema = React.useMemo(() => {
    switch (mode) {
      case PASSWORD_MANIPULATION_MODE.SETUP_ACCOUNT:
      case PASSWORD_MANIPULATION_MODE.SETUP_ACCOUNT_AND_CREATE_PROFILE:
      case PASSWORD_MANIPULATION_MODE.CREATE_ACCOUNT_AND_PROFILE:
      case PASSWORD_MANIPULATION_MODE.CHANGE_PASSWORD:
        return Yup.object().shape({
          newPassword: Yup.string().test('password', t('pwTooWeak'), value =>
            __DEV__ ? true : zxcvbn(value!).score >= 2,
          ),
          confirmPassword: Yup.string().oneOf([Yup.ref('newPassword')], t('pwMustMatch')),
        });
      case PASSWORD_MANIPULATION_MODE.RESET_PASSWORD:
        // TODO: Provide validation schema for reset password.
        return null;
    }
  }, [mode, t]);

  const {
    loading,
    headerText,
    descriptionText,
    pwInputLabel,
    buttonLabel,
    handleFormSubmit,
    initialFormValues,
  } = useHooks();

  return (
    <DView style={styles.container} topBar={<TopBar />} backgroundColor={theme.colors.white}>
      <Spacer paddingBottom="s" />
      <Typography.H3 style={styles.headerText}>{headerText}</Typography.H3>
      {descriptionText && (
        <Spacer paddingBottom={32}>
          <Typography.Body6>{descriptionText}</Typography.Body6>
        </Spacer>
      )}
      {/* nested ternary to fix next button behavior on small screen devices
       values greater than 75 will cause the button to shift upwards after a TextInput is focused
       */}
      <KeyboardAvoidingView
        keyboardVerticalOffset={10}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={CommonStyles.flex[1]}>
        <Formik
          initialValues={initialFormValues}
          onSubmit={handleFormSubmit}
          validationSchema={validationSchema}>
          {({ handleSubmit, values, errors, setFieldValue, setFieldError }) => {
            return (
              <>
                <ScrollView
                  contentContainerStyle={CommonStyles.flexGrow['1']}
                  ref={scrollViewRef}
                  keyboardDismissMode="on-drag">
                  <View style={styles.labelGroup}>
                    <Typography.Subtitle2>{t(pwInputLabel as any)}</Typography.Subtitle2>
                    {!isUserTyping && values.newPassword.length > 0 && (
                      <PasswordChecker strengthLevel={zxcvbn(values.newPassword).score} />
                    )}
                  </View>
                  <DSecureTextInput
                    testID="newPasswordField"
                    value={values.newPassword}
                    onChangeText={(value: string) => {
                      debounceTyping();
                      setFieldValue('newPassword', value, true);
                      setFieldError('newPassword', undefined);
                    }}
                    style={styles.inputLabel}
                    placeholder={t('new password')}
                    // error={!!errors.newPassword}
                  />
                  {errors.newPassword && (
                    <PasswordChecksGroup label={errors.newPassword} mode="error" />
                  )}
                  {!isUserTyping && values.newPassword.length > 0 && (
                    <PasswordChecksGroup passwordToCheck={values.newPassword} mode="password" />
                  )}
                  <Spacer paddingBottom="m" />
                  <Typography.Subtitle2 style={styles.bottomLabel}>
                    {t('confirm password')}
                  </Typography.Subtitle2>
                  <DSecureTextInput
                    error={errors.confirmPassword !== undefined}
                    testID="confirmPasswordField"
                    inputRef={confirmPasswordRef}
                    onOuterFocus={() =>
                      setTimeout(
                        () =>
                          scrollViewRef.current?.scrollToEnd({
                            animated: true,
                          }),
                        300,
                      )
                    }
                    placeholder={t('password')}
                    value={values.confirmPassword}
                    style={styles.inputLabel}
                    onChangeText={(value: string) => {
                      setFieldValue('confirmPassword', value, true);
                      setFieldError('confirmPassword', undefined);
                    }}
                  />
                  {errors.confirmPassword && (
                    <PasswordChecksGroup label={errors.confirmPassword} mode="error" />
                  )}
                </ScrollView>
                {loading ? (
                  <Box alignItems="center" py="m">
                    <StyledSpinner />
                  </Box>
                ) : (
                  <Button
                    size={44}
                    backgroundColor={theme.colors.surfaceBlack}
                    textColor={theme.colors.white}
                    onPress={() => handleSubmit()}
                    disabled={
                      loading ||
                      values.confirmPassword.length === 0 ||
                      values.newPassword.length === 0 ||
                      _.flatten(Object.values(errors)).length > 0
                    }>
                    {t(buttonLabel as any)}
                  </Button>
                )}
              </>
            );
          }}
        </Formik>
      </KeyboardAvoidingView>
    </DView>
  );
};

export default PasswordManipulation;
