import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps, useRoute } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { passwordStrength } from 'check-password-strength';
import Button from 'components/Button';
import DSecureTextInput from 'components/DSecureTextInput';
import DView from 'components/DView';
import PasswordReqGroup from 'components/PasswordReqGroup';
import Spacer from 'components/Spacer';
import TopBar from 'components/TopBar';
import Typography from 'components/Typography';
import { Formik } from 'formik';
import { MIN_PW_LENGTH } from 'lib/ValidationUtils';
import _ from 'lodash';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import { BottomTabsParamList } from 'navigation/RootNavigator/BottomTabs';
import ROUTES from 'navigation/routes';
import React, { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Platform, ScrollView, TextInput, View } from 'react-native';
import { Box, useTheme } from 'native-base';
import * as Yup from 'yup';
import { AccountWithWallet } from 'types/account';
import CommonStyles from 'config/theme/CommonStyles';
import StyledSpinner from 'components/StyledSpinner';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import useHooks from './useHooks';
import useStyles from './useStyles';

export enum PASSWORD_MANIPULATION_MODE {
  CHANGE_PASSWORD,
  RESET_PASSWORD,
  SETUP_PASSWORD,
}

export type PasswordManipulationParams = {
  mode: PASSWORD_MANIPULATION_MODE;

  /**
   * Account that need to be saved.
   */
  account?: AccountWithWallet;

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
  const { t } = useTranslation('passwordManipulation');
  const styles = useStyles();
  const theme = useTheme();
  const scrollViewRef = useRef<ScrollView>(null);
  const confirmPasswordRef = useRef<TextInput>(null);
  const {
    params: { mode },
  } = useRoute<NavProps['route']>();

  const { bottom: bottomSafeInset } = useSafeAreaInsets();

  const validationSchema = React.useMemo(() => {
    switch (mode) {
      case PASSWORD_MANIPULATION_MODE.SETUP_PASSWORD:
        return Yup.object().shape({
          confirmPassword: Yup.string()
            .required(t('error:required'))
            .oneOf([Yup.ref('newPassword')], t('error:pwMustMatch')),
        });
      case PASSWORD_MANIPULATION_MODE.CHANGE_PASSWORD:
        return Yup.object().shape({
          confirmPassword: Yup.string().required(t('error:required')),
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
    mapPwStyle,
    initialFormValues,
  } = useHooks();

  // Animations
  const [animatedPswChecksVisible, setAnimatedPswChecksVisible] = useState(false);
  const animatedOpacity = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(animatedOpacity.value, [0, 1], [0, 1]),
    };
  });

  // Child components

  const animatedPasswordChecks = useCallback(
    (values: any) => {
      return (
        animatedPswChecksVisible && (
          <Animated.View style={[animatedStyle, styles.marginXs]}>
            <PasswordReqGroup passwordToCheck={values.newPassword} />
          </Animated.View>
        )
      );
    },
    [animatedPswChecksVisible, animatedStyle, styles.marginXs],
  );

  return (
    <DView style={styles.container} topBar={<TopBar />} backgroundColor={theme.colors.white}>
      <Typography.H3 style={styles.headerText}>{t(headerText)}</Typography.H3>

      {descriptionText && (
        <Spacer paddingBottom={32}>
          <Typography.Body6>{t(descriptionText)}</Typography.Body6>
        </Spacer>
      )}
      {/* nested ternary to fix next button behavior on small screen devices
      values greater than 75 will cause the button to shift upwards after a TextInput is focused
      */}
      <KeyboardAvoidingView
        keyboardVerticalOffset={Platform.OS === 'ios' ? (bottomSafeInset ? 125 : 75) : 0}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={CommonStyles.flex[1]}>
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
                    <Typography.Subtitle2>{t(pwInputLabel)}</Typography.Subtitle2>

                    {values.newPassword.length >= MIN_PW_LENGTH && (
                      <Typography.Subtitle4 style={mapPwStyle(values.newPassword)}>
                        {t(passwordStrength(values.newPassword).value)}
                      </Typography.Subtitle4>
                    )}
                  </View>

                  <DSecureTextInput
                    testID="newPasswordField"
                    onOuterFocus={() => {
                      setAnimatedPswChecksVisible(true);
                      animatedOpacity.value = withTiming(1);
                    }}
                    onOuterBlur={() => {
                      animatedOpacity.value = withTiming(0);
                      setAnimatedPswChecksVisible(false);
                    }}
                    value={values.newPassword}
                    onChangeText={(value: string) => setFieldValue('newPassword', value, true)}
                    style={styles.inputLabel}
                    placeholder={t('newPw')}
                    // error={!!errors.newPassword}
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
                    placeholder={t('pw')}
                    value={values.confirmPassword}
                    style={styles.inputLabel}
                    onChangeText={(value: string) => setFieldValue('confirmPassword', value, true)}
                  />
                  {errors.confirmPassword && (
                    <Typography.Caption1 style={styles.errorText}>
                      {errors.confirmPassword}
                    </Typography.Caption1>
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
                    {t(buttonLabel)}
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
