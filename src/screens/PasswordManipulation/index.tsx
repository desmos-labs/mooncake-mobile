import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {CompositeScreenProps} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {passwordStrength} from 'check-password-strength';
import Button, {ButtonMode} from 'components/Button';
import DSecureTextInput from 'components/DSecureTextInput';
import DView from 'components/DView';
import PasswordReqGroup from 'components/PasswordReqGroup';
import Spacer from 'components/Spacer';
import TopBar from 'components/TopBar';
import Typography from 'components/Typography';
import {Formik} from 'formik';
import {MIN_PW_LENGTH} from 'lib/ValidationUtils';
import _ from 'lodash';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import {BottomTabsParamList} from 'navigation/RootNavigator/BottomTabs';
import ROUTES from 'navigation/routes';
import React, {useRef} from 'react';
import {useTranslation} from 'react-i18next';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from 'react-native';
import {useTheme} from 'react-native-paper';
import * as Yup from 'yup';
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
   * If a mnemonic is passed with mode: PASSWORD_MANIPULATION_MODE.SETUP_PASSWORD,
   * it means the user is importing an account using a recovery phrase
   */
  mnemonic?: string;

  /**
   * Old password passed from origin screen.
   */
  oldPassword?: string;
};

export type NavProps = CompositeScreenProps<
  StackScreenProps<RootNavigatorParamList, ROUTES.PASSWORD_MANIPULATION>,
  BottomTabScreenProps<BottomTabsParamList, ROUTES.USER_PROFILE>
>;

const PasswordManipulation = () => {
  const {t} = useTranslation('passwordManipulation');
  const styles = useStyles();
  const theme = useTheme();
  const scrollViewRef = useRef<ScrollView>(null);

  const validationSchema = React.useMemo(() => {
    return Yup.object().shape({
      /*      newPassword: Yup.string()
        .min(
          MIN_PW_LENGTH,
          t('error:minChar', {
            numChar: MIN_PW_LENGTH,
          }),
        )
        .required(t('error:required'))
        .test('at least one lowercase', '', validateMin1Lowercase)
        .test('at least one uppercase', '', validateMin1Uppercase)
        .test('at least one special', '', validateMin1SpecialChar), */
      confirmPassword: Yup.string()
        .required(t('error:required'))
        .oneOf([Yup.ref('newPassword')], t('error:pwMustMatch')),
    });
  }, []);

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

  return (
    <DView style={styles.container} topBar={<TopBar />}>
      <Typography.H3 style={styles.headerText}>{t(headerText)}</Typography.H3>

      {descriptionText && (
        <Spacer paddingBottom={32}>
          <Typography.Body6>{t(descriptionText)}</Typography.Body6>
        </Spacer>
      )}
      <KeyboardAvoidingView
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{flex: 1}}>
        <Formik
          initialValues={initialFormValues}
          onSubmit={handleFormSubmit}
          validationSchema={validationSchema}>
          {({handleSubmit, values, errors, setFieldValue}) => {
            return (
              <>
                <ScrollView
                  ref={scrollViewRef}
                  keyboardDismissMode="on-drag"
                  style={{flex: 1}}>
                  <View style={styles.labelGroup}>
                    <Typography.Subtitle2>
                      {t(pwInputLabel)}
                    </Typography.Subtitle2>

                    {values.newPassword.length >= MIN_PW_LENGTH && (
                      <Typography.Subtitle4
                        style={mapPwStyle(values.newPassword)}>
                        {t(passwordStrength(values.newPassword).value)}
                      </Typography.Subtitle4>
                    )}
                  </View>

                  <DSecureTextInput
                    value={values.newPassword}
                    onChangeText={(value: string) =>
                      setFieldValue('newPassword', value, true)
                    }
                    style={styles.inputLabel}
                    placeholder={t('newPw')}
                    // error={!!errors.newPassword}
                  />

                  {errors.newPassword && (
                    <Typography.Caption1 style={styles.errorText}>
                      {errors.newPassword}
                    </Typography.Caption1>
                  )}

                  <PasswordReqGroup passwordToCheck={values.newPassword} />

                  <Typography.Subtitle2 style={styles.inputLabel}>
                    {t('confirmPw')}
                  </Typography.Subtitle2>
                  <DSecureTextInput
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
                    onChangeText={(value: string) =>
                      setFieldValue('confirmPassword', value, true)
                    }
                    // error={!!errors.confirmPassword}
                  />
                  {errors.confirmPassword && (
                    <Typography.Caption1 style={styles.errorText}>
                      {errors.confirmPassword}
                    </Typography.Caption1>
                  )}
                </ScrollView>
                {loading ? (
                  <View style={styles.loadingView}>
                    <ActivityIndicator color={theme.colors.surfaceBlack} />
                  </View>
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
                    }
                    mode={ButtonMode.CONTAINED}>
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
