import {useFocusEffect, useRoute} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {useButterConfig} from '@recoil/butterConfigState';
import {iconButton} from 'assets/images';
import Button from 'components/Button';
import DTextInput from 'components/DTextInput';
import Spacer from 'components/Spacer';
import Typography from 'components/Typography';
import {Formik} from 'formik';
import _ from 'lodash';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import {ActivityIndicator, useTheme} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import useHooks from './useHooks';
import useStyles from './useStyles';

export type SendTipsParams = {
  postAuthor: string;
  postId?: number;
};

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.SEND_TIPS>;

const SendTips = () => {
  const {butterConfig} = useButterConfig();
  const {params} = useRoute<NavProps['route']>();
  const [message, setMessage] = React.useState<string>('');
  const {t} = useTranslation('sendTips');
  const styles = useStyles();
  const theme = useTheme();
  const {
    activeAddress,
    refetch,
    loading,
    editable,
    handleSendTip,
    sendTipLoading,
    goBack,
    initialFormValues,
    validateForm,
    convertedBalance,
  } = useHooks();

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  const handlePressConfirm = React.useCallback(
    (values: any) => {
      handleSendTip({
        amount: parseInt(values.amount, 10),
        receiver: params.postAuthor,
        sender: activeAddress!,
        postId: params.postId!,
      });
    },
    [handleSendTip, params.postAuthor, params.postId, activeAddress],
  );

  return (
    // marginTop to offset the tabIcon's top spacing
    <SafeAreaView edges={['top']} style={{flex: 1, marginTop: theme.spacing.l}}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{flex: 1}}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={goBack}
          style={styles.container}>
          {/* dummy touchable opacity to prevent modal from getting dismissed if non-button */}
          {/* parts of the modal content are pressed */}

          <TouchableOpacity
            activeOpacity={1}
            style={styles.innerContainer}
            onPress={() => Keyboard.dismiss()}>
            <View style={styles.tabIcon} />
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
                    <Typography.Body6>{t('description')}</Typography.Body6>
                    <Spacer paddingBottom={16} />
                    <Typography.Subtitle3>{t('subtitle')}</Typography.Subtitle3>
                    <Spacer paddingBottom={14} />
                    <View style={styles.buttonGroup}>
                      <Button
                        disabled={!editable}
                        mode={values.amount === '1' ? 'contained' : 'outlined'}
                        style={styles.tipButton}
                        contentStyle={styles.tipButtonContent}
                        onPress={() => {
                          setFieldValue('amount', '1', true);
                        }}>
                        <Typography.Subtitle3
                          style={{
                            color:
                              values.amount === '1'
                                ? theme.colors.white
                                : theme.colors.surfaceBlack,
                            textTransform: 'uppercase',
                          }}>
                          1 DSM
                        </Typography.Subtitle3>
                      </Button>
                      <Button
                        disabled={!editable}
                        mode={values.amount === '5' ? 'contained' : 'outlined'}
                        style={styles.tipButton}
                        contentStyle={styles.tipButtonContent}
                        onPress={() => {
                          setFieldValue('amount', '5', true);
                        }}>
                        <Typography.Subtitle3
                          style={{
                            color:
                              values.amount === '5'
                                ? theme.colors.white
                                : theme.colors.surfaceBlack,
                            textTransform: 'uppercase',
                          }}>
                          5 DSM
                        </Typography.Subtitle3>
                      </Button>
                      <Button
                        disabled={!editable}
                        mode={values.amount === '10' ? 'contained' : 'outlined'}
                        style={styles.tipButton}
                        contentStyle={styles.tipButtonContent}
                        onPress={() => {
                          setFieldValue('amount', '10', true);
                        }}>
                        <Typography.Subtitle3
                          style={{
                            color:
                              values.amount === '10'
                                ? theme.colors.white
                                : theme.colors.surfaceBlack,
                            textTransform: 'uppercase',
                          }}>
                          10 DSM
                        </Typography.Subtitle3>
                      </Button>
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
                        color={theme.colors.butterOrange01}
                      />
                    ) : (
                      <Typography.Body7
                        style={{color: theme.colors.accentGreen01}}>
                        {/* we will need to format accordingly this number */}
                        {t('available')} {convertedBalance?.amount}{' '}
                        {convertedBalance?.denom.toUpperCase()}
                      </Typography.Body7>
                    )}
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Image
                        source={iconButton}
                        style={{width: 16, height: 16, marginRight: 4}}
                      />
                      <Typography.Body7
                        style={{
                          color: theme.colors.surfaceBlack,
                          marginVertical: theme.spacing.s,
                        }}>
                        {t('warning fee', {
                          fee: butterConfig.contracts.tips.fees.percentage,
                        })}
                      </Typography.Body7>
                    </View>

                    <Spacer paddingVertical={20}>
                      <Typography.Subtitle3>
                        {t('message')}
                      </Typography.Subtitle3>
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
                      <Button
                        loading={sendTipLoading}
                        mode="contained"
                        color={theme.colors.surfaceBlack}
                        onPress={handleSubmit}
                        disabled={
                          values.amount === '' ||
                          _.flatten(Object.values(errors)).length > 0
                        }>
                        {t('common:confirm')}
                      </Button>
                    </Spacer>
                  </ScrollView>
                );
              }}
            </Formik>
          </TouchableOpacity>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SendTips;
