import {useLazyQuery, useQuery} from '@apollo/client';
import {passwordStrength} from 'check-password-strength';
import Button from 'components/Button';
import CustomCheckbox from 'components/CustomCheckbox';
import DSecureTextInput from 'components/DSecureTextInput';
import DTextInput from 'components/DTextInput';
import DView from 'components/DView';
import Spacer from 'components/Spacer';
import Typography from 'components/Typography';
import {Formik} from 'formik';
import _ from 'lodash';
import React, {useCallback, useEffect, useMemo} from 'react';
import {Trans, useTranslation} from 'react-i18next';
import {KeyboardAvoidingView, Platform, ScrollView, View} from 'react-native';
import {IconButton, useTheme} from 'react-native-paper';
import PasswordTooltip from 'screens/PasswordManipulation/components/PasswordTooltip';
import GetDTagAvailability from 'services/graphql/queries/GetDTagAvailability';
import GetProfileParams from 'services/graphql/queries/GetProfileParams';
import * as Yup from 'yup';
import useHooks from './useHooks';
import useStyles from './useStyles';

const MIN_PW_LENGTH = 10;

const Signup = () => {
  const {t} = useTranslation('passwordManipulation');
  const theme = useTheme();
  const styles = useStyles();
  const [availableDTag, setAvailableDTag] = React.useState<boolean>(true);
  const [dtagParams, setDtagParams] = React.useState<any>({});
  const [getDTagAvailability] = useLazyQuery(GetDTagAvailability);
  const {data} = useQuery(GetProfileParams);
  const {
    handlePressPP,
    handlePressTOS,
    handleFormSubmit,
    openInfoModal,
    validateForm,
    initialFormValues,
  } = useHooks();

  useEffect(() => {
    if (data) {
      setDtagParams(data.profiles_params[0].params.dtag);
    }
  }, [data]);

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
          MIN_PW_LENGTH,
          t('error:minChar', {
            numChar: MIN_PW_LENGTH,
          }),
        )
        .required(t('error:required'))
        .test('at least one lowercase', '', value =>
          /(?=.*[a-z])/.test(value as string),
        )
        .test('at least one uppercase', '', value =>
          /(?=.*[A-Z])/.test(value as string),
        )
        .test('at least one special', '', value =>
          /(?=.*\W)/.test(value as string),
        ),
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
          t('error:minChar', {
            numChar: dtagParams.max_length,
          }),
        )
        .test(
          'respect reg_ex',
          t('Only _ is allowed as special character'),
          value => {
            console.log(value);
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
    <DView style={styles.container}>
      <Typography.H3 style={styles.headerText}>
        {t('signup:signup')}
      </Typography.H3>
      <KeyboardAvoidingView
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
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
                <ScrollView>
                  <View style={styles.formContainer}>
                    <View style={styles.dTagRowContainer}>
                      <Typography.Subtitle2>
                        {t('signup:profile dtag')}
                      </Typography.Subtitle2>
                      <IconButton
                        icon="information-outline"
                        onPress={() => openInfoModal()}
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
                      error={!!errors.dTag || !availableDTag}
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
                      onChangeText={(value: string) =>
                        setFieldValue('newPassword', value, true)
                      }
                      style={styles.inputLabel}
                      placeholder={t('newPw')}
                      error={!!errors.newPassword}
                    />

                    {errors.newPassword && (
                      <Typography.Caption1 style={styles.errorText}>
                        {errors.newPassword}
                      </Typography.Caption1>
                    )}

                    <PasswordTooltip
                      label={t('atLeastChar', {
                        length: MIN_PW_LENGTH,
                      })}
                      isSatisfied={values.newPassword.length >= MIN_PW_LENGTH}
                    />

                    <PasswordTooltip
                      label={t('atLeastLower')}
                      isSatisfied={/(?=.*[a-z])/.test(values.newPassword)}
                    />

                    <PasswordTooltip
                      label={t('atLeastUpper')}
                      isSatisfied={/(?=.*[A-Z])/.test(values.newPassword)}
                    />

                    <Spacer paddingBottom={theme.spacing.m}>
                      <PasswordTooltip
                        label={t('atLeastSpecial')}
                        isSatisfied={/(?=.*\W)/.test(values.newPassword)}
                      />
                    </Spacer>

                    <Typography.Subtitle2 style={styles.inputLabel}>
                      {t('confirmPw')}
                    </Typography.Subtitle2>
                    <DSecureTextInput
                      placeholder={t('pw')}
                      onChangeText={(value: string) =>
                        setFieldValue('confirmPassword', value, true)
                      }
                      error={!!errors.confirmPassword}
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
                      setFieldValue('consent', !values.consent, false)
                    }
                    error={!!errors.consent}
                  />

                  <Typography.Body6 style={styles.consentText}>
                    <Trans
                      i18nKey="mnemonicInput:userConsent"
                      components={[
                        <Typography.Body6
                          onPress={handlePressTOS}
                          style={styles.touchableText}
                        />,
                        <Typography.Body6
                          onPress={handlePressPP}
                          style={styles.touchableText}
                        />,
                      ]}
                    />
                  </Typography.Body6>
                </View>
                <Button
                  onPress={handleSubmit}
                  disabled={
                    !values.dTag ||
                    !values.confirmPassword ||
                    !values.newPassword ||
                    !values.consent ||
                    !availableDTag ||
                    _.flatten(Object.values(errors)).length > 0
                  }
                  containerStyle={{marginTop: 10}}
                  mode="gradientFilled">
                  <Typography.Button2 style={styles.confirmButtonText}>
                    {t('common:confirm')}
                  </Typography.Button2>
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
