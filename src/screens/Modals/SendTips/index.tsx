import { infoIcon } from 'assets/images';
import BottomUpModalWrapper from 'components/BottomUpModalWrapper';
import Button from 'components/Button';
import DTextInput from 'components/DTextInput';
import Spacer from 'components/Spacer';
import Typography from 'components/Typography';
import { Formik } from 'formik';
import _ from 'lodash';
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { HStack, useTheme } from 'native-base';
import { StackScreenProps } from '@react-navigation/stack';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import useAccountBalance from 'hooks/balance/useAccountBalance';
import { formatCoins } from 'lib/FormatUtils';
import { TipTarget } from 'types/tips';
import CommonStyles from 'config/theme/CommonStyles';
import StyledSpinner from 'components/StyledSpinner';
import useCustomToast from 'hooks/extended/useCustomToast';
import useStyles from './useStyles';
import {
  FormValues,
  useDefaultTipsAmounts,
  useInitialFormValues,
  useSendTipToTarget,
  useShouldDisableTipButton,
  useTipFeePercentage,
  useValidateForm,
} from './hooks';

export type SendTipsParams = {
  target: TipTarget;
};

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.POST_SEND_TIPS>;

/**
 * Screen that allows the user to tip a given post.
 * @constructor
 */
const SendTips = (props: NavProps) => {
  const { goBack, pop } = useNavigation<NavProps['navigation']>();
  const { t } = useTranslation('sendTips');
  const styles = useStyles();
  const theme = useTheme();
  const toast = useCustomToast();
  const { route } = props;
  const { params } = route;
  const { target } = params;

  // -------------------------------------------------------------------------------------
  // --- Tip config
  // -------------------------------------------------------------------------------------

  const defaultTipsAmounts = useDefaultTipsAmounts();
  const tipFee = useTipFeePercentage();

  // -------------------------------------------------------------------------------------
  // --- User balance
  // -------------------------------------------------------------------------------------

  const { balance, refetch: refetchBalance, loading: loadingBalance } = useAccountBalance();
  const shouldDisableTipButton = useShouldDisableTipButton(balance);

  // -------------------------------------------------------------------------------------
  // --- Form config
  // -------------------------------------------------------------------------------------

  const initialFormValues = useInitialFormValues();
  const validateForm = useValidateForm(balance);
  const canEdit = useMemo(
    () => !loadingBalance && balance.length > 0,
    [loadingBalance, balance.length],
  );

  // -------------------------------------------------------------------------------------
  // --- Form submission
  // -------------------------------------------------------------------------------------

  const sendTip = useSendTipToTarget(target);

  const [message, setMessage] = useState<string>('');
  const [sendingTip, setSendingTip] = useState<boolean>(false);
  const handleSubmitForm = useCallback(
    async (values: FormValues) => {
      setSendingTip(true);
      const result = await sendTip(values);
      if (result.isErr()) {
        console.error(result);
        toast.errorNoRetry(result.error.message);
      }

      setSendingTip(false);
      pop();
    },
    [pop, sendTip, toast],
  );

  // -------------------------------------------------------------------------------------
  // --- Effects
  // -------------------------------------------------------------------------------------

  useFocusEffect(
    useCallback(() => {
      refetchBalance();
    }, [refetchBalance]),
  );

  // -------------------------------------------------------------------------------------
  // --- Screen rendering
  // -------------------------------------------------------------------------------------

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={CommonStyles.flex[1]}>
      <BottomUpModalWrapper goBack={goBack} paddingHorizontal={0.1} paddingBottom={0.1}>
        <Formik
          initialValues={initialFormValues}
          onSubmit={handleSubmitForm}
          validate={validateForm}>
          {({ handleSubmit, values, errors, setFieldValue }) => {
            return (
              <ScrollView contentContainerStyle={styles.contentContainer}>
                <Typography.H4 style={styles.headerText}>{t('header')}</Typography.H4>
                <Spacer paddingBottom={16} />
                <Typography.Subtitle3>{t('subtitle')}</Typography.Subtitle3>
                <Spacer paddingBottom={14} />
                <View style={styles.buttonGroup}>
                  {defaultTipsAmounts.map(value => {
                    return (
                      <Button
                        key={String(value)}
                        backgroundColor={
                          values.amount === String(value)
                            ? theme.colors.butterOrange01
                            : theme.colors.white
                        }
                        textColor={
                          values.amount === String(value) ? theme.colors.white : theme.colors.black
                        }
                        disabled={!canEdit || shouldDisableTipButton(value)}
                        size={44}
                        style={[
                          // can ignore this as it is part of the conditional style that requires the mapped value variable.
                          // eslint-disable-next-line react-native/no-inline-styles
                          {
                            minWidth: 106,
                            borderWidth: 1,
                          },
                          // Use disabled style if user has lack of funds, otherwise show orange outline if the denomination
                          // is selected, or black if unselected
                          shouldDisableTipButton(value)
                            ? {
                                borderColor: theme.colors.tabIconGrey,
                              }
                            : values.amount === String(value)
                              ? {
                                  borderColor: theme.colors.butterOrange01,
                                }
                              : {
                                  borderColor: theme.colors.surfaceBlack,
                                },
                        ]}
                        onPress={() => {
                          setFieldValue('amount', String(value), true);
                        }}>
                        {`${value} DSM`}
                      </Button>
                    );
                  })}
                </View>
                <Spacer paddingBottom={20} />
                <DTextInput
                  editable={canEdit}
                  value={values.amount}
                  onChangeText={(value: string) => {
                    setFieldValue('amount', value, true);
                  }}
                  keyboardType="numeric"
                  numberOfLines={1}
                  style={styles.textInput}
                  placeholder={t('insert amount')}
                  rightElement={<Typography.Subtitle3 numberOfLines={1}>DSM</Typography.Subtitle3>}
                />
                {errors.amount && (
                  <Typography.Caption1 style={styles.amountErrorText}>
                    {errors.amount}
                  </Typography.Caption1>
                )}
                <Spacer paddingBottom={10} />

                {/* When we have the selected account properties, we will show the available balance and disable the buttons accordingly */}
                {loadingBalance ? (
                  <StyledSpinner style={styles.spinnerPosition} />
                ) : (
                  <Typography.Body7 style={{ color: theme.colors.accentGreen01 }}>
                    {formatCoins(balance)}
                  </Typography.Body7>
                )}
                <HStack alignItems="center">
                  <Image source={infoIcon} style={styles.infoIcon} />
                  <Typography.Body7
                    style={{
                      color: theme.colors.surfaceBlack,
                      marginVertical: theme.spacing.s,
                    }}>
                    {t('warning fee', { fee: tipFee })}
                  </Typography.Body7>
                </HStack>

                <Spacer paddingVertical={20}>
                  <Typography.Subtitle3>{t('message')}</Typography.Subtitle3>
                </Spacer>
                <DTextInput
                  multiline
                  editable={canEdit}
                  inputStyle={styles.messageInput}
                  value={message}
                  onChangeText={text => setMessage(text)}
                  style={styles.textInput}
                  placeholder={t('message')}
                />
                <Spacer paddingVertical={30}>
                  <Button
                    isLoading={sendingTip}
                    size={44}
                    textColor={theme.colors.white}
                    backgroundColor={theme.colors.surfaceBlack}
                    onPress={handleSubmit}
                    disabled={values.amount === '' || _.flatten(Object.values(errors)).length > 0}>
                    {t('common:confirm')}
                  </Button>
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
