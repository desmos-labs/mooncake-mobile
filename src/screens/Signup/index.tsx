import {useLazyQuery} from '@apollo/client';
import {useNavigation} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {passwordStrength} from 'check-password-strength';
import Button from 'components/Button';
import DSecureTextInput from 'components/DSecureTextInput';
import DTextInput from 'components/DTextInput';
import DView from 'components/DView';
import Spacer from 'components/Spacer';
import Typography from 'components/Typography';
import {Formik} from 'formik';
import _ from 'lodash';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {KeyboardAvoidingView, Platform, ScrollView, View} from 'react-native';
import {IconButton, useTheme} from 'react-native-paper';
import PasswordTooltip from 'screens/PasswordManipulation/components/PasswordTooltip';
import GetDTagAvailability from 'services/graphql/queries/GetDTagAvailability';
import * as Yup from 'yup';
import useStyles from './useStyles';

const initialFormValues = {
  dTag: '',
  newPassword: '',
  confirmPassword: '',
};

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.SIGNUP>;

const MIN_PW_LENGTH = 10;

const PasswordManipulation = () => {
  const {t} = useTranslation('passwordManipulation');
  const theme = useTheme();
  const {navigate} = useNavigation<NavProps['navigation']>();
  const styles = useStyles();
  const [validDtag, setValidDtag] = React.useState<boolean>(true);
  const [getDTagAvailability] = useLazyQuery(GetDTagAvailability);
  const handleFormSubmit = React.useCallback(
    (formValues: typeof initialFormValues) => {
      console.log(formValues);
    },
    [],
  );

  const openInfoModal = useCallback(() => {
    navigate(ROUTES.TEXTONLY_MODAL, {
      title: t('signup:profile dtag'),
      body: t('signup:dtag info'),
    });
  }, []);

  const checkAvailability = useCallback(async (newDtag: string) => {
    const result = await getDTagAvailability({variables: {dTag: newDtag}});
    if (result.data.profile.length !== 0) {
      setValidDtag(false);
      return;
    }
    setValidDtag(true);
  }, []);

  const validationSchema = React.useMemo(() => {
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
    });
  }, []);

  const mapPwStyle = React.useCallback((password: string) => {
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
          validationSchema={validationSchema}>
          {({handleSubmit, values, errors, setFieldValue}) => {
            console.log(errors);
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
                        setFieldValue('dTag', value, false);
                      }}
                      style={styles.inputLabel}
                      placeholder={t('signup:enter dtag')}
                      error={!!errors.dTag}
                    />
                    <Typography.Caption1 style={styles.errorTextDtag}>
                      {validDtag ? '' : t('signup:dtag taken')}
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
                <Button
                  onPress={handleSubmit}
                  disabled={
                    !values.confirmPassword ||
                    !values.newPassword ||
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

export default PasswordManipulation;
