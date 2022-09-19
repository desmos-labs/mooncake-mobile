import {useLazyQuery} from '@apollo/client';
import {useNavigation} from '@react-navigation/native';
import {useGetProfileParams} from '@recoil/profileParams';
import {iconButton} from 'assets/images';
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
import {
  MIN_PW_LENGTH,
  validateMin1Lowercase,
  validateMin1SpecialChar,
  validateMin1Uppercase,
} from 'lib/ValidationUtils';
import _ from 'lodash';
import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import {Trans, useTranslation} from 'react-i18next';
import {KeyboardAvoidingView, Platform, ScrollView, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import GetDTagAvailability from 'services/graphql/queries/GetDTagAvailability';
import * as Yup from 'yup';
import useHooks from './useHooks';
import useStyles from './useStyles';

const Signup = () => {
  const {t} = useTranslation('passwordManipulation');
  const {goBack} = useNavigation();
  const theme = useTheme();
  const styles = useStyles();
  const [availableDTag, setAvailableDTag] = React.useState<boolean>(true);
  const [dtagParams, setDtagParams] = React.useState<any>({});
  const [getDTagAvailability] = useLazyQuery(GetDTagAvailability);
  const scrollViewRef = useRef<ScrollView>(null);
  const {
    handlePressPP,
    handlePressTOS,
    handleFormSubmit,
    openInfoModal,
    validateForm,
    initialFormValues,
  } = useHooks();

  const {profileParams} = useGetProfileParams();

  useEffect(() => {
    setDtagParams(profileParams.dtag);
  }, []);

  /**
   * Check with a query if the dTag is available
   */
  const checkAvailability = useCallback(async (newDtag: string) => {
    const result = await getDTagAvailability({variables: {dTag: newDtag}});
    if (result.data.profile.length !== 0) {
      setAvailableDTag(false);
      return;
    }
    setAvailableDTag(true);
  }, []);

  const validationSchema = useMemo(() => {
    return Yup.object().shape({
      newPassword: Yup.string()
        .min(
          MIN_PW_LENGTH - 1,
          t('error:minChar', {
            numChar: MIN_PW_LENGTH,
          }),
        )
        .required(t('error:required'))
        .test('at least one lowercase', '', validateMin1Lowercase)
        .test('at least one uppercase', '', validateMin1Uppercase)
        .test('at least one special', '', validateMin1SpecialChar),
      confirmPassword: Yup.string()
        .required(t('error:required'))
        .oneOf([Yup.ref('newPassword')], t('error:pwMustMatch')),
      dTag: Yup.string()
        .required(t('error:required'))
        .min(
          dtagParams.min_length,
          t('error:minChar', {
            numChar: dtagParams.min_length,
          }),
        )
        .max(
          dtagParams.max_length,
          t('error:maxChar', {
            numChar: dtagParams.max_length,
          }),
        )
        .test(
          'respect reg_ex',
          t('Only _ is allowed as special character'),
          value => {
            return new RegExp(dtagParams.reg_ex, 'g').test(value as string);
          },
        ),
    });
  }, [dtagParams]);

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

  return (
    <DView
      style={styles.container}
      topBar={
        <Spacer paddingLeft={theme.spacing.m} paddingTop={theme.spacing.s}>
          <BackButton onPress={goBack} />
        </Spacer>
      }
      statusBarProps={{
        barStyle: 'dark-content',
      }}>
      <Typography.H3 style={styles.headerText}>
        {t('signup:signup')}
      </Typography.H3>
      <KeyboardAvoidingView
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.buttonGroup}>
        <Formik
          initialValues={initialFormValues}
          onSubmit={handleFormSubmit}
          validationSchema={validationSchema}
          validate={validateForm}>
          {({handleSubmit, values, errors, setFieldValue}) => {
            return (
              <>
                <ScrollView ref={scrollViewRef}>
                  <View style={styles.formContainer}>
                    <View style={styles.dTagRowContainer}>
                      <Typography.Subtitle2>
                        {t('signup:profile dtag')}
                      </Typography.Subtitle2>
                      <ImageButton
                        style={styles.iconButton}
                        image={iconButton}
                        onPress={openInfoModal}
                      />
                    </View>

                    <DTextInput
                      value={values.dTag}
                      onChangeText={(value: string) => {
                        checkAvailability(value);
                        setFieldValue('dTag', value, true);
                      }}
                      style={styles.inputLabel}
                      placeholder={t('signup:enter dtag')}
                      // error={!!errors.dTag || !availableDTag}
                    />
                    {errors.dTag && (
                      <Typography.Caption1 style={styles.errorText}>
                        {errors.dTag}
                      </Typography.Caption1>
                    )}
                    <Typography.Caption1 style={styles.errorTextDtag}>
                      {availableDTag ? '' : t('signup:dtag taken')}
                    </Typography.Caption1>
                    <View style={styles.labelGroup}>
                      <Typography.Subtitle2>
                        {t('enterNewPw')}
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
                      onChangeText={(value: string) => {
                        setFieldValue('newPassword', value, true);
                      }}
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
                          400,
                        )
                      }
                      placeholder={t('pw')}
                      value={values.confirmPassword}
                      onChangeText={(value: string) => {
                        setFieldValue('confirmPassword', value, true);
                      }}
                      // error={!!errors.confirmPassword}
                    />
                    {errors.confirmPassword && (
                      <Typography.Caption1
                        style={[styles.errorText, {marginBottom: 20}]}>
                        {errors.confirmPassword}
                      </Typography.Caption1>
                    )}
                  </View>
                </ScrollView>
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
                          onPress={handlePressPP}
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
                  color={theme.colors.surfaceBlack}
                  disabled={
                    !values.dTag ||
                    !values.confirmPassword ||
                    !values.newPassword ||
                    !values.consent ||
                    !availableDTag ||
                    _.flatten(Object.values(errors)).length > 0
                  }
                  mode="contained">
                  {t('common:next')}
                </Button>
              </>
            );
          }}
        </Formik>
      </KeyboardAvoidingView>
    </DView>
  );
};

export default Signup;
