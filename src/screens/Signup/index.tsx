import { useNavigation, useRoute } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { passwordStrength } from 'check-password-strength';
import BackButton from 'components/BackButton';
import Button from 'components/Button';
import DSecureTextInput from 'components/DSecureTextInput';
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
import { useTranslation } from 'react-i18next';
import { Linking, ScrollView, TextInput, View } from 'react-native';
import { Box, useTheme } from 'native-base';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useResetSignUpState } from '@recoil/screens/signUpState';
import useCustomToast from 'hooks/extended/useCustomToast';
import { AccountWithWallet } from 'types/account';
import StyledSpinner from 'components/StyledSpinner';
import * as Yup from 'yup';
import DTextInput from 'components/DTextInput';
import ImageButton from 'components/ImageButton';
import { infoIcon } from 'assets/images';
import { SignUpStatus, useInitialFormValues, useSubmitForm } from './hooks';
import useStyles from './useStyles';

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.SIGNUP>;

export interface SignupParams {
  /**
   * Account generated with web3auth
   */
  account: AccountWithWallet;
}

/**
 * Screen that allows a user to sign up for a new account by inserting a password and an invitation code.
 * @constructor
 */
const Signup = () => {
  const { t } = useTranslation('passwordManipulation');
  const { reset, goBack, navigate } = useNavigation<NavProps['navigation']>();
  const {
    params: { account },
  } = useRoute<NavProps['route']>();
  const theme = useTheme();
  const styles = useStyles();
  const toast = useCustomToast();
  const confirmPasswordRef = useRef<TextInput>(null);

  // Form state
  const initialFormValues = useInitialFormValues();
  const resetSignUpInfo = useResetSignUpState();

  const validationSchema = React.useMemo(() => {
    return Yup.object().shape({
      confirmPassword: Yup.string()
        .required(t('error:required'))
        .oneOf([Yup.ref('newPassword')], t('error:pwMustMatch')),
    });
  }, [t]);

  // Animations
  const [animatedPswChecksVisible, setAnimatedPswChecksVisible] = useState(false);
  const animatedOpacity = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(animatedOpacity.value, [0, 1], [0, 1]),
    };
  });

  // Callback that is used when the signup completes properly
  const onSuccess = useCallback(() => {
    // Redirect fresh user to Discover Tab as they won't be following anyone
    reset({
      index: 0,
      routes: [
        {
          name: ROUTES.BOTTOM_TABS,
          params: {
            screen: ROUTES.HOME_TABS,
            params: { initialRouteName: ROUTES.HOME_TAB_DISCOVER },
          },
        },
      ],
    });
  }, [reset]);

  // Callback that is used when the signup procedure raises any error
  const onError = useCallback(
    (error: Error) => {
      toast.errorNoRetry(error.message);
    },
    [toast],
  );

  const openInviteInfoModal = useCallback(() => {
    navigate(ROUTES.CONFIRM_MODAL, {
      title: t('signup:invite info title'),
      subtitle: t('signup:invite info body'),
      subtitleStyle: styles.inviteInfoBody,
      primaryButtonLabel: t('signup:join butter discord'),
      onPressPrimary: () => {
        Linking.openURL('https://discord.gg/KsdUmerM5U');
      },
    });
  }, [navigate, styles.inviteInfoBody, t]);

  // Hook that is used in order to submit the form
  const { handleFormSubmit, signUpStatus } = useSubmitForm(account, onSuccess, onError);

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
          <Animated.View style={[animatedStyle, styles.pswCheck]}>
            <PasswordReqGroup passwordToCheck={values.newPassword} />
          </Animated.View>
        )
      );
    },
    [animatedPswChecksVisible, animatedStyle, styles.pswCheck],
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
        validationSchema={validationSchema}>
        {({ handleSubmit, values, errors, setFieldValue }) => {
          return (
            <>
              <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                ref={scrollViewRef}
                keyboardDismissMode="on-drag">
                <View style={styles.labelGroup}>
                  <Typography.Subtitle2 style={styles.topLabel}>
                    {t('signup:password')}
                  </Typography.Subtitle2>
                  {values.newPassword.length >= MIN_PW_LENGTH && (
                    <Typography.Subtitle4 style={mapPwStyle(values.newPassword)}>
                      {t(passwordStrength(values.newPassword).value)}
                    </Typography.Subtitle4>
                  )}
                </View>

                <DSecureTextInput
                  error={errors.newPassword !== undefined}
                  onOuterFocus={() => {
                    setAnimatedPswChecksVisible(true);
                    animatedOpacity.value = withTiming(1);
                  }}
                  value={values.newPassword}
                  onChangeText={(value: string) => {
                    setFieldValue('newPassword', value, true);
                  }}
                  style={[styles.inputLabel, styles.inputStandard]}
                  placeholder={t('signup:enter password')}
                />
                {errors.newPassword && (
                  <Typography.Caption1 style={styles.errorText}>
                    {errors.newPassword}
                  </Typography.Caption1>
                )}

                {animatedPasswordChecks(values)}

                <Typography.Subtitle2 style={styles.bottomLabel}>
                  {t('confirmPw')}
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
                  placeholder={t('signup:enter password')}
                  value={values.confirmPassword}
                  style={[styles.inputLabel, styles.inputStandard]}
                  onChangeText={(value: string) => setFieldValue('confirmPassword', value, true)}
                />
                {errors.confirmPassword && (
                  <Typography.Caption1 style={styles.errorText}>
                    {errors.confirmPassword}
                  </Typography.Caption1>
                )}
                <Box flexDir="row" style={styles.bottomLabel}>
                  <Typography.Subtitle2>{t('signup:invite code')}</Typography.Subtitle2>
                  <ImageButton
                    image={infoIcon}
                    style={styles.infoIcon}
                    onPress={openInviteInfoModal}
                  />
                </Box>

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
                  style={[styles.inputLabel, styles.inputStandard]}
                  placeholder={t('signup:enter invite code')}
                />
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
                  {t('signup:next create a profile')}
                </Button>
              )}
            </>
          );
        }}
      </Formik>
    </DView>
  );
};

export default Signup;
