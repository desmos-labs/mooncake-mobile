import { useNavigation } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { passwordStrength } from 'check-password-strength';
import BackButton from 'components/BackButton';
import Button, {ButtonMode} from 'components/Button';
import CustomCheckbox from 'components/CustomCheckbox';
import DSecureTextInput from 'components/DSecureTextInput';
import DTextInput from 'components/DTextInput';
import DView from 'components/DView';
import PasswordReqGroup from 'components/PasswordReqGroup';
import Spacer from 'components/Spacer';
import Typography from 'components/Typography';
import { Formik } from 'formik';
import { MIN_PW_LENGTH } from 'lib/ValidationUtils';
import _ from 'lodash';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useResetSignUpState } from '@recoil/screens/signUpState';
import { useToast } from 'react-native-toast-notifications';
import ToastConfig from 'config/ToastConfig';
import {
  SignUpStatus,
  useHandlePressPrivacyPolicy,
  useHandlePressTOS,
  useInitialFormValues,
  useSubmitForm,
  useValidateForm,
  useValidationSchema,
} from './hooks';
import useStyles from './useStyles';

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.SIGNUP>;

/**
 * Screen that allows a user to sign up for a new account by inserting a password and an invitation code.
 * @constructor
 */
const Signup = () => {
  const { t } = useTranslation('passwordManipulation');
  const { navigate, goBack } = useNavigation<NavProps['navigation']>();
  const theme = useTheme();
  const styles = useStyles();
  const toast = useToast();

  // Form validation
  const validationSchema = useValidationSchema();
  const validateForm = useValidateForm();

  // Form state
  const initialFormValues = useInitialFormValues();
  const resetSignUpInfo = useResetSignUpState();

  // Animations
  const [animatedPswChecksVisible, setAnimatedPswChecksVisible] = useState(false);
  const animatedOpacity = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(animatedOpacity.value, [0, 1], [0, 1]),
    };
  });

  // Actions
  const handlePressPrivacyPolicy = useHandlePressPrivacyPolicy();
  const handlePressTOS = useHandlePressTOS();

  // Callback that is used when the signup completes properly
  const onSuccess = useCallback(() => {
    navigate(ROUTES.WELCOME);
  }, [navigate]);

  // Callback that is used when the signup procedure raises any error
  const onError = useCallback(
    (error: Error) => {
      // TODO: Show the error here, maybe in a modal
      toast.show(error.message, {
        type: ToastConfig.ERROR_NO_RETRY,
      });
    },
    [toast],
  );

  // Hook that is used in order to submit the form
  const { handleFormSubmit, signUpStatus } = useSubmitForm(onSuccess, onError);

  // Check if the sign up flow is completed
  // TODO: Probably this indication can be improved with a more explicit UI that tells the steps being done
  const loading = useMemo(
    () => signUpStatus !== SignUpStatus.UNDEFINED && signUpStatus !== SignUpStatus.DONE,
    [signUpStatus],
  );

  // Reset recoil state on entry
  React.useEffect(() => {
    resetSignUpInfo();
    // Disable the lint on the next line in order to have this being called only
    // the first time that the user enters this screen (to avoid reset on goBack)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scrollViewRef = useRef<ScrollView>(null);

  const mapPwStyle = useCallback(
    (password: string) => {
      const { value } = passwordStrength(password);
      switch (value) {
        case 'Medium':
          return styles.mediumPw;
        case 'Strong':
          return styles.strongPw;
        default:
          return styles.weakPw;
      }
    },
    [styles],
  );

  const animatedPasswordChecks = useCallback(
    (values: any) => {
      return (
        animatedPswChecksVisible && (
          <Animated.View style={animatedStyle}>
            <PasswordReqGroup passwordToCheck={values.newPassword} />
          </Animated.View>
        )
      );
    },
    [animatedPswChecksVisible, animatedStyle],
  );

  return (
    <DView
      backgroundColor={theme.colors.white}
      style={styles.container}
      topBar={
        <View style={{ backgroundColor: theme.colors.white }}>
          <Spacer paddingLeft={theme.spacing.m} paddingTop={theme.spacing.s}>
            <BackButton onPress={goBack} />
          </Spacer>
        </View>
      }>
      <Typography.H3 style={styles.headerText}>{t('signup:signup')}</Typography.H3>
      <Formik
        initialValues={initialFormValues}
        onSubmit={handleFormSubmit}
        validationSchema={validationSchema}
        validate={validateForm}>
        {({ handleSubmit, values, errors, setFieldValue }) => {
          return (
            <>
              <KeyboardAvoidingView
                keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.buttonGroup}>
                <ScrollView ref={scrollViewRef} keyboardDismissMode="on-drag">
                  <View style={styles.formContainer}>
                    <View style={styles.labelGroup}>
                      <Typography.Subtitle2>{t('signup:password')}</Typography.Subtitle2>
                      {values.newPassword.length >= MIN_PW_LENGTH && (
                        <Typography.Subtitle4 style={mapPwStyle(values.newPassword)}>
                          {t(passwordStrength(values.newPassword).value)}
                        </Typography.Subtitle4>
                      )}
                    </View>

                    <DSecureTextInput
                      onOuterFocus={() => {
                        setAnimatedPswChecksVisible(true);
                        animatedOpacity.value = withTiming(1);
                      }}
                      value={values.newPassword}
                      onChangeText={(value: string) => {
                        setFieldValue('newPassword', value, true);
                      }}
                      style={styles.inputLabel}
                      placeholder={t('signup:enter password')}
                    />

                    {errors.newPassword && (
                      <Typography.Caption1 style={styles.errorText}>
                        {errors.newPassword}
                      </Typography.Caption1>
                    )}
                    {animatedPasswordChecks(values)}
                    <Spacer paddingBottom={theme.spacing.m} />
                    <Typography.Subtitle2 style={{ marginBottom: theme.spacing.s }}>
                      {t('signup:invite code')}
                    </Typography.Subtitle2>
                    <DTextInput
                      onFocus={() => {
                        setTimeout(
                          () =>
                            scrollViewRef.current?.scrollToEnd({
                              animated: true,
                            }),
                          400,
                        );
                      }}
                      value={values.inviteCode}
                      onChangeText={(value: string) => {
                        setFieldValue('inviteCode', value, true);
                      }}
                      style={styles.inputLabel}
                      placeholder={t('signup:invite code')}
                    />
                  </View>
                </ScrollView>
              </KeyboardAvoidingView>
              <>
                <View style={styles.consentGroup}>
                  <CustomCheckbox
                    checked={values.consent}
                    handlePress={() => setFieldValue('consent', !values.consent, true)}
                    error={!!errors.consent}
                  />

                  <Typography.Body6 style={styles.consentText}>
                    <Trans
                      i18nKey="mnemonicInput:userConsent"
                      components={[
                        <Typography.Body6
                          onPress={handlePressTOS}
                          style={
                            values.consent ? styles.touchableTextChecked : styles.touchableText
                          }
                        />,
                        <Typography.Body6
                          onPress={handlePressPrivacyPolicy}
                          style={
                            values.consent ? styles.touchableTextChecked : styles.touchableText
                          }
                        />,
                      ]}
                    />
                  </Typography.Body6>
                </View>
                <Button
                  onPress={handleSubmit}
                  loading={loading}
                  backgroundColor={theme.colors.surfaceBlack}
                  size={44}
                  textColor={theme.colors.white}
                  disabled={
                    !values.newPassword ||
                    !values.consent ||
                    !values.inviteCode ||
                    _.flatten(Object.values(errors)).length > 0
                  }
                  mode={ButtonMode.CONTAINED}>
                  {t('common:next')}
                </Button>
              </>
            </>
          );
        }}
      </Formik>
    </DView>
  );
};

export default Signup;
