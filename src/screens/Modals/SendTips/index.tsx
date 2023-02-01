import {infoIcon} from 'assets/images';
import BottomUpModalWrapper from 'components/BottomUpModalWrapper';
import Button from 'components/Button';
import DTextInput from 'components/DTextInput';
import Spacer from 'components/Spacer';
import Typography from 'components/Typography';
import {Formik} from 'formik';
import _ from 'lodash';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from 'react-native';
import {useTheme} from 'react-native-paper';
import useHooks, {TIP_AMOUNTS} from './useHooks';
import useStyles from './useStyles';

export type SendTipsParams = {
  postAuthor: string;
  postId?: number;
};

const SendTips = () => {
  const [message, setMessage] = React.useState<string>('');
  const {t} = useTranslation('sendTips');
  const styles = useStyles();
  const theme = useTheme();
  const {
    loading,
    editable,
    sendTipLoading,
    goBack,
    initialFormValues,
    validateForm,
    convertedBalance,
    shouldDisableTipButton,
    tipFee,
    handlePressConfirm,
  } = useHooks();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{flex: 1}}>
      <BottomUpModalWrapper
        goBack={goBack}
        paddingHorizontal={0.1}
        paddingBottom={0.1}>
        <Formik
          initialValues={initialFormValues}
          onSubmit={handlePressConfirm}
          validate={validateForm}>
          {({handleSubmit, values, errors, setFieldValue}) => {
            return (
              <ScrollView contentContainerStyle={styles.contentContainer}>
                <Typography.H4 style={styles.headerText}>
                  {t('header')}
                </Typography.H4>
                <Spacer paddingBottom={16} />
                <Typography.Subtitle3>{t('subtitle')}</Typography.Subtitle3>
                <Spacer paddingBottom={14} />
                <View style={styles.buttonGroup}>
                  {TIP_AMOUNTS.map(value => {
                    return (
                      <Button
                        key={String(value)}
                        disabled={
                          !editable || shouldDisableTipButton[String(value)]
                        }
                        mode={
                          values.amount === String(value)
                            ? 'contained'
                            : 'outlined'
                        }
                        backgroundColor={
                          values.amount === String(value)
                            ? theme.colors.butterOrange01
                            : theme.colors.white
                        }
                        textColor={
                          values.amount === String(value)
                            ? theme.colors.white
                            : theme.colors.black
                        }
                        size={44}
                        additionalStyle={[
                          {
                            minWidth: 106,
                          },
                          shouldDisableTipButton[String(value)]
                            ? {
                                borderColor: theme.colors.tabIconGrey,
                              }
                            : {
                                borderColor: theme.colors.surfaceBlack,
                              },
                        ]}
                        onPress={() => {
                          setFieldValue('amount', String(value), true);
                        }}>
                        {value} DSM
                      </Button>
                    );
                  })}
                </View>
                <Spacer paddingBottom={20} />
                <DTextInput
                  editable={editable}
                  value={values.amount}
                  onChangeText={(value: string) => {
                    setFieldValue('amount', value, true);
                  }}
                  keyboardType="numeric"
                  numberOfLines={1}
                  style={styles.textInput}
                  placeholder={t('insert amount')}
                  rightElement={
                    <Typography.Subtitle3 numberOfLines={1}>
                      DSM
                    </Typography.Subtitle3>
                  }
                />
                {errors.amount && (
                  <Typography.Caption1
                    style={{marginTop: 6, color: theme.colors.pink01}}>
                    {errors.amount}
                  </Typography.Caption1>
                )}
                <Spacer paddingBottom={10} />

                {/* when we will have the selected account properties we will show the available balance and disable the buttons accordingly */}
                {loading ? (
                  <ActivityIndicator
                    style={{left: 0, marginRight: 'auto'}}
                    size={16}
                    color={theme.colors.surfaceBlack}
                  />
                ) : (
                  <Typography.Body7 style={{color: theme.colors.accentGreen01}}>
                    {/* we will need to format accordingly this number */}
                    {t('available')} {convertedBalance?.amount}{' '}
                    {convertedBalance?.denom.toUpperCase()}
                  </Typography.Body7>
                )}
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Image
                    source={infoIcon}
                    style={{width: 16, height: 16, marginRight: 4}}
                  />
                  <Typography.Body7
                    style={{
                      color: theme.colors.surfaceBlack,
                      marginVertical: theme.spacing.s,
                    }}>
                    {t('warning fee', {
                      fee: tipFee,
                    })}
                  </Typography.Body7>
                </View>

                <Spacer paddingVertical={20}>
                  <Typography.Subtitle3>{t('message')}</Typography.Subtitle3>
                </Spacer>
                <DTextInput
                  editable={editable}
                  inputStyle={styles.messageInput}
                  value={message}
                  onChangeText={text => setMessage(text)}
                  style={styles.textInput}
                  multiline
                  placeholder={t('message')}
                />
                <Spacer paddingVertical={30}>
                  {sendTipLoading ? (
                    <View style={styles.loadingView}>
                      <ActivityIndicator color={theme.colors.surfaceBlack} />
                    </View>
                  ) : (
                    <Button
                      mode="contained"
                      size={44}
                      textColor={theme.colors.white}
                      backgroundColor={theme.colors.surfaceBlack}
                      onPress={() => handleSubmit()}
                      disabled={
                        values.amount === '' ||
                        _.flatten(Object.values(errors)).length > 0
                      }>
                      {t('common:confirm')}
                    </Button>
                  )}
                </Spacer>
              </ScrollView>
            );
          }}
        </Formik>
      </BottomUpModalWrapper>
    </KeyboardAvoidingView>
  );
};

export default SendTips;
