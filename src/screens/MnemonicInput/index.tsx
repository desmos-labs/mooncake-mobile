import React from 'react';
import DView from 'components/DView';
import Typography from 'components/Typography';
import {StackScreenProps} from '@react-navigation/stack';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import DTextInput from 'components/DTextInput';
import DButton from 'components/DButton';
import {Formik} from 'formik';
import {validateMnemonic} from 'lib/ValidationUtils';
import {sanitizeMnemonic} from 'lib/FormatUtils';
import {
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  View,
} from 'react-native';
import {PASSWORD_MANIPULATION_MODE} from 'screens/PasswordManipulation';
import useStyles from './useStyles';

export enum MNEMONIC_INPUT_MODE {
  RESET_PASSWORD,
}

export type MnemonicInputParams = {
  mode: MNEMONIC_INPUT_MODE;
};

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.MNEMONIC_INPUT>;

const initialFormFields = {
  mnemonic: '',
};

type FormFields = typeof initialFormFields;

const MnemonicInput = () => {
  const {
    params: {mode},
  } = useRoute<NavProps['route']>();

  const {navigate} = useNavigation<NavProps['navigation']>();

  const styles = useStyles();

  const {t} = useTranslation();

  const headerText = React.useMemo(() => {
    switch (mode) {
      case MNEMONIC_INPUT_MODE.RESET_PASSWORD:
        return 'forgotPassword:forgotPw';
      default:
        return '';
    }
  }, [mode]);

  const validateForm = React.useCallback((values: FormFields) => {
    const errors: any = {};

    if (!validateMnemonic(sanitizeMnemonic(values.mnemonic))) {
      errors.mnemonic = t('forgotPassword:invalidMnemonic');
    }

    return errors;
  }, []);

  const onSubmit = React.useCallback(
    (values: FormFields) => {
      console.log(values);

      if (mode === MNEMONIC_INPUT_MODE.RESET_PASSWORD) {
        navigate(ROUTES.PASSWORD_MANIPULATION, {
          mode: PASSWORD_MANIPULATION_MODE.RESET_PASSWORD,
        });
      }
    },
    [mode],
  );

  return (
    <DView style={styles.container}>
      <Typography.H3>{headerText}</Typography.H3>
      <Typography.Body6 style={styles.descriptionText}>
        {t('forgotPassword:description')}
      </Typography.Body6>

      <Formik
        initialValues={initialFormFields}
        validate={validateForm}
        validateOnChange={false}
        onSubmit={onSubmit}>
        {({handleSubmit, errors, values, setValues, resetForm}) => (
          <View style={styles.formContainer}>
            <Typography.Subtitle2 style={styles.inputLabel}>
              {t('forgotPassword:inputPlaceholder')}
            </Typography.Subtitle2>

            <DTextInput
              multiline
              error={!!errors.mnemonic}
              style={[
                styles.mnemonicInput,
                errors.mnemonic ? styles.errorInput : undefined,
              ]}
              placeholder={t('forgotPassword:inputPlaceholder')}
              value={values.mnemonic}
              onChangeText={text => {
                setValues({mnemonic: text}, false);
              }}
            />

            {errors.mnemonic && (
              <View style={styles.errorGroup}>
                <Typography.Caption1 style={styles.errorColor}>
                  {errors.mnemonic}
                </Typography.Caption1>

                <TouchableOpacity
                  onPress={() => {
                    resetForm({values: initialFormFields});
                  }}>
                  <Typography.Subtitle4 style={styles.clearAllText}>
                    {t('forgotPassword:clearAll')}
                  </Typography.Subtitle4>
                </TouchableOpacity>
              </View>
            )}

            <KeyboardAvoidingView
              keyboardVerticalOffset={Platform.OS === 'ios' ? 180 : 0}
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
              style={styles.buttonGroup}>
              <DButton
                mode="gradientFilled"
                labelStyle={styles.labelStyle}
                onPress={handleSubmit}>
                {t('common:confirm')}
              </DButton>
            </KeyboardAvoidingView>
          </View>
        )}
      </Formik>
    </DView>
  );
};

export default MnemonicInput;
