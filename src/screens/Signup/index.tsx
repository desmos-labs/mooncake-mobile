import {useNavigation} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {infoIcon} from 'assets/images';
import {passwordStrength} from 'check-password-strength';
import BackButton from 'components/BackButton';
import Button from 'components/Button';
import CustomCheckbox from 'components/CustomCheckbox';
import DSecureTextInput from 'components/DSecureTextInput';
import DTextInput from 'components/DTextInput';
import DView from 'components/DView';
import ImageButton from 'components/ImageButton';
import PasswordReqGroup from 'components/PasswordReqGroup';
import Spacer from 'components/Spacer';
import Typography from 'components/Typography';
import {Formik} from 'formik';
import {MIN_PW_LENGTH} from 'lib/ValidationUtils';
import _ from 'lodash';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, {useCallback, useMemo, useRef, useState} from 'react';
import {Trans, useTranslation} from 'react-i18next';
import {KeyboardAvoidingView, Platform, ScrollView, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {
  SaveProfileStatus,
  SignUpStatus,
  useCheckDTagAvailability,
  useHandlePressPrivacyPolicy,
  useHandlePressTOS,
  useInitialFormValues,
  useOpenInfoModal,
  useSubmitForm,
  useValidateForm,
  useValidationSchema,
} from 'screens/Signup/hooks';
import {
  useResetSignUpState,
  useSetSignUpValue,
} from '@recoil/screens/signUpState';
import useStyles from './useStyles';

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.SIGNUP>;

const Signup = () => {
  const {t} = useTranslation('passwordManipulation');
  const {navigate, goBack} = useNavigation<NavProps['navigation']>();
  const theme = useTheme();
  const styles = useStyles();

  // Form validation
  const validationSchema = useValidationSchema();
  const validateForm = useValidateForm();
  const checkDTagAvailability = useCheckDTagAvailability();
  const [availableDTag, setAvailableDTag] = React.useState<boolean>(true);

  // Form state
  const initialFormValues = useInitialFormValues();
  const setSignUpDTag = useSetSignUpValue('dTag');
  const resetSignUpInfo = useResetSignUpState();
  const openInfoModal = useOpenInfoModal();

  // Animations
  const [animatedPswChecksVisible, setAnimatedPswChecksVisible] =
    useState(false);
  const animatedOpacity = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(animatedOpacity.value, [0, 1], [0, 1]),
    };
  });

  // Actions
  const handlePressPrivacyPolicy = useHandlePressPrivacyPolicy();
  const handlePressTOS = useHandlePressTOS();
  const {handleFormSubmit, signUpStatus, saveProfileStatus} = useSubmitForm();

  // Check if either the signup or profile saving flows are not completed.
  // TODO: Probably this indication can be improved with a more explicit UI that tells the steps being done
  const loading = useMemo(
    () =>
      signUpStatus !== SignUpStatus.DONE &&
      saveProfileStatus !== SaveProfileStatus.DONE,
    [signUpStatus, saveProfileStatus],
  );

  // Reset recoil state on entry
  React.useEffect(() => {
    resetSignUpInfo();
  }, []);

  const scrollViewRef = useRef<ScrollView>(null);

  /**
   * Function to check if the input DTag is available.
   */
  const checkAvailability = useCallback(
    async (newDTag: string) => {
      const isAvailable = await checkDTagAvailability(newDTag);
      setAvailableDTag(isAvailable);
    },
    [checkDTagAvailability],
  );

  const mapPwStyle = useCallback((password: string) => {
    const {value} = passwordStrength(password);
    switch (value) {
      case 'Medium':
        return styles.mediumPw;
      case 'Strong':
        return styles.strongPw;
      default:
        return styles.weakPw;
    }
  }, []);

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
    [animatedPswChecksVisible],
  );

  return (
    <DView
      backgroundColor={theme.colors.white}
      style={styles.container}
      topBar={
        <View style={{backgroundColor: theme.colors.white}}>
          <Spacer paddingLeft={theme.spacing.m} paddingTop={theme.spacing.s}>
            <BackButton onPress={goBack} />
          </Spacer>
        </View>
      }>
      <Typography.H3 style={styles.headerText}>
        {t('signup:signup')}
      </Typography.H3>
      <Formik
        initialValues={initialFormValues}
        onSubmit={handleFormSubmit}
        validationSchema={validationSchema}
        validate={validateForm}>
        {({handleSubmit, values, errors, setFieldValue}) => {
          return (
            <>
              <KeyboardAvoidingView
                keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.buttonGroup}>
                <ScrollView ref={scrollViewRef} keyboardDismissMode="on-drag">
                  <View style={styles.formContainer}>
                    <View style={styles.dTagRowContainer}>
                      <Typography.Subtitle2>
                        {t('signup:profile dtag')}
                      </Typography.Subtitle2>
                      <ImageButton
                        style={styles.iconButton}
                        image={infoIcon}
                        onPress={openInfoModal}
                      />
                    </View>

                    <DTextInput
                      value={values.dTag}
                      onChangeText={(value: string) => {
                        checkAvailability(value);
                        setFieldValue('dTag', value, true);
                        setSignUpDTag(value);
                      }}
                      style={styles.inputLabel}
                      placeholder={t('signup:enter dtag')}
                    />
                    {errors.dTag && (
                      <Typography.Caption1 style={styles.errorText}>
                        {errors.dTag}
                      </Typography.Caption1>
                    )}
                    <Button
                      mode="text"
                      style={styles.completeProfileButton}
                      onPress={() => {
                        navigate(ROUTES.CREATE_DESMOS_PROFILE);
                      }}>
                      <Typography.Body6 style={styles.completeProfileButton}>
                        {t('signup:completeProfile')}
                      </Typography.Body6>
                    </Button>

                    <Typography.Caption1 style={styles.errorTextDtag}>
                      {availableDTag ? '' : t('signup:dtag taken')}
                    </Typography.Caption1>

                    <View style={styles.labelGroup}>
                      <Typography.Subtitle2>
                        {t('signup:password')}
                      </Typography.Subtitle2>
                      {values.newPassword.length >= MIN_PW_LENGTH && (
                        <Typography.Subtitle4
                          style={mapPwStyle(values.newPassword)}>
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
                      // error={!!errors.newPassword}
                    />

                    {errors.newPassword && (
                      <Typography.Caption1 style={styles.errorText}>
                        {errors.newPassword}
                      </Typography.Caption1>
                    )}
                    {animatedPasswordChecks(values)}
                    <Spacer paddingBottom={theme.spacing.m} />
                    <Typography.Subtitle2
                      style={{marginBottom: theme.spacing.s}}>
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
                    handlePress={() =>
                      setFieldValue('consent', !values.consent, true)
                    }
                    error={!!errors.consent}
                  />

                  <Typography.Body6 style={styles.consentText}>
                    <Trans
                      i18nKey="mnemonicInput:userConsent"
                      components={[
                        <Typography.Body6
                          onPress={handlePressTOS}
                          style={
                            values.consent
                              ? styles.touchableTextChecked
                              : styles.touchableText
                          }
                        />,
                        <Typography.Body6
                          onPress={handlePressPrivacyPolicy}
                          style={
                            values.consent
                              ? styles.touchableTextChecked
                              : styles.touchableText
                          }
                        />,
                      ]}
                    />
                  </Typography.Body6>
                </View>
                <Button
                  onPress={handleSubmit}
                  loading={loading}
                  color={theme.colors.surfaceBlack}
                  disabled={
                    !values.dTag ||
                    !values.newPassword ||
                    !values.consent ||
                    !values.inviteCode ||
                    !availableDTag ||
                    _.flatten(Object.values(errors)).length > 0
                  }
                  mode="contained">
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
